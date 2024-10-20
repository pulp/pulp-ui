import { repositoryBasePath } from 'src/utilities';
import { PulpAPI } from './pulp';
import {
  type CollectionUploadType,
  type CollectionVersionSearch,
} from './response-types/collection';

const base = new PulpAPI();
base.apiPath = '_ui/v1/repo/';

export const CollectionAPI = {
  deleteCollection: ({
    collection_version: { namespace, name },
    repository,
  }: CollectionVersionSearch) =>
    repositoryBasePath(repository.name, repository.pulp_href).then(
      (distroBasePath) =>
        base.http.delete(
          `v3/plugin/ansible/content/${distroBasePath}/collections/index/${namespace}/${name}/`,
        ),
    ),

  deleteCollectionVersion: ({
    collection_version: { namespace, name, version },
    repository,
  }: CollectionVersionSearch) =>
    repositoryBasePath(repository.name, repository.pulp_href).then(
      (distroBasePath) =>
        base.http.delete(
          `v3/plugin/ansible/content/${distroBasePath}/collections/index/${namespace}/${name}/versions/${version}/`,
        ),
    ),

  getContent: (namespace, name, version) =>
    base.list(
      {
        namespace,
        name,
        version,
      },
      `pulp/api/v3/content/ansible/collection_versions/`,
    ),

  getDetail: (distroBasePath, namespace, name) =>
    base.http.get(
      `v3/plugin/ansible/content/${distroBasePath}/collections/index/${namespace}/${name}/`,
    ),

  getDownloadURL: (repository, namespace, name, version) =>
    // UI API doesn't have tarball download link, so query it separately here
    repositoryBasePath(repository.name, repository.pulp_href).then(
      (distroBasePath) =>
        base.http
          .get(
            `v3/plugin/ansible/content/${distroBasePath}/collections/index/${namespace}/${name}/versions/${version}/`,
          )
          .then(({ data: { download_url } }) => download_url),
    ),

  getSignatures: (repository, namespace, name, version) =>
    repositoryBasePath(repository.name, repository.pulp_href).then(
      (distroBasePath) =>
        base.http.get(
          `v3/plugin/ansible/content/${distroBasePath}/collections/index/${namespace}/${name}/versions/${version}/`,
        ),
    ),

  getUsedDependenciesByCollection: (namespace, collection, params = {}) =>
    base.http.get(
      `_ui/v1/collection-versions/?dependency=${namespace}.${collection}`,
      base.mapParams(params),
    ),

  list: (params?, repo?: string) =>
    base.list(params, base.apiPath + repo + '/'),

  setDeprecation: ({
    collection_version: { namespace, name },
    repository,
    is_deprecated,
  }: CollectionVersionSearch): Promise<{ data: { task: string } }> =>
    repositoryBasePath(repository.name, repository.pulp_href).then(
      (distroBasePath) =>
        base.patch(
          `${namespace}/${name}`,
          {
            deprecated: !is_deprecated,
          },
          `v3/plugin/ansible/content/${distroBasePath}/collections/index/`,
        ),
    ),

  upload: (
    data: CollectionUploadType,
    progressCallback: (e) => void,
    cancelToken?,
  ) => {
    const formData = new FormData();
    formData.append('file', data.file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressCallback,
    };

    if (cancelToken) {
      config['cancelToken'] = cancelToken.token;
    }

    if (data.distro_base_path) {
      return base.http.post(
        `v3/plugin/ansible/content/${data.distro_base_path}/collections/artifacts/`,
        formData,
        config,
      );
    } else {
      return base.http.post('v3/artifacts/collections/', formData, config);
    }
  },
};
