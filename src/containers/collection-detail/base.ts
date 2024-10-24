import {
  CollectionAPI,
  type CollectionDetailType,
  CollectionVersionAPI,
  type CollectionVersionContentType,
  type CollectionVersionSearch,
} from 'src/api';
import { type AlertType } from 'src/components';
import { repositoryBasePath } from 'src/utilities';

export interface IBaseCollectionState {
  actuallyCollection?: CollectionDetailType;
  alerts?: AlertType[];
  collection?: CollectionVersionSearch;
  collections?: CollectionVersionSearch[];
  collectionsCount?: number;
  content?: CollectionVersionContentType;
  distroBasePath?: string;
  notFound?: boolean;
  params: {
    version?: string;
    showing?: string;
    keywords?: string;
  };
}

// Caches the collection data when matching, prevents redundant fetches between collection detail tabs
const cache = {
  repository: null,
  namespace: null,
  name: null,
  version: null,

  actuallyCollection: null,
  collection: null,
  collections: [],
  collectionsCount: 0,
  content: null,
};

export function loadCollection({
  forceReload,
  matchParams,
  setCollection,
  setNotFound,
  stateParams,
}) {
  const { version } = stateParams;
  const { collection: name, namespace, repo } = matchParams;

  // try loading from cache
  if (
    !forceReload &&
    cache.repository === repo &&
    cache.namespace === namespace &&
    cache.name === name &&
    cache.version === version
  ) {
    setCollection(
      cache.collections,
      cache.collection,
      cache.content,
      cache.collectionsCount,
      cache.actuallyCollection,
    );
    return;
  }

  const requestParams = {
    ...(repo ? { repository_name: repo } : {}),
    namespace,
    name,
  };

  const currentVersion = (
    version
      ? CollectionVersionAPI.list({ ...requestParams, version })
      : CollectionVersionAPI.list({ ...requestParams /* is_highest: true */ })
  ).then(({ data }) => data.results[0]);

  const content = currentVersion
    .then((collection) =>
      CollectionAPI.getContent(
        namespace,
        name,
        collection.collection_version.version,
      ),
    )
    .then(({ data: { results } }) => results[0])
    .catch(() => setNotFound(true));

  // Note: this only provides the first page - containing the latest version, and all items for the version *selector*,
  // but the version *modal* is using a separate call, in CollectionHeader updatePaginationParams
  const versions = CollectionVersionAPI.list({
    ...requestParams,
    order_by: '-version',
    page_size: 10,
  })
    .then(({ data }) => data)
    .catch(() => ({ results: [], count: 0 }));

  const actuallyCollection = repositoryBasePath(repo)
    .then((basePath) => CollectionAPI.getDetail(basePath, namespace, name))
    .then(({ data }) => data);

  return Promise.all([
    versions,
    currentVersion,
    content,
    actuallyCollection,
  ]).then(
    ([
      { results: collections, count: collectionsCount },
      collection,
      content,
      actuallyCollection,
    ]) => {
      setCollection(
        collections,
        collection,
        content,
        collectionsCount,
        actuallyCollection,
      );

      cache.repository = repo;
      cache.namespace = namespace;
      cache.name = name;
      cache.version = version;

      cache.actuallyCollection = actuallyCollection;
      cache.collection = collection;
      cache.collections = collections;
      cache.collectionsCount = collectionsCount;
      cache.content = content;
    },
  );
}
