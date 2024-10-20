import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'v3/plugin/ansible/search/collection-versions/';
base.sortParam = 'order_by'; // FIXME

export const CollectionVersionAPI = {
  copy: (
    namespace: string,
    name: string,
    version: string,
    source_base_path: string,
    destination_base_path: string,
  ) =>
    base.create(
      {},
      `v3/collections/${namespace}/${name}/versions/${version}/copy/${source_base_path}/${destination_base_path}/`,
    ),

  get: (id: string) =>
    base.get(id, 'pulp/api/v3/content/ansible/collection_versions/'),

  getUsedDependenciesByCollection: (namespace, collection, params = {}) =>
    base.http.get(
      base.apiPath + `?dependency=${namespace}.${collection}`,
      base.mapParams(params),
    ),

  list: (params?) => base.list(params),

  move: (
    namespace: string,
    name: string,
    version: string,
    source_base_path: string,
    destination_base_path: string,
  ) =>
    base.create(
      {},
      `v3/collections/${namespace}/${name}/versions/${version}/move/${source_base_path}/${destination_base_path}/`,
    ),
};
