import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const CollectionVersionAPI = {
  copy: (
    namespace: string,
    name: string,
    version: string,
    source_base_path: string,
    destination_base_path: string,
  ) =>
    // FIXME HubAPI
    base.http.post(
      `v3/collections/${namespace}/${name}/versions/${version}/copy/${source_base_path}/${destination_base_path}/`,
      {},
    ),

  get: (id: string) =>
    base.http.get(`content/ansible/collection_versions/${id}/`),

  getUsedDependenciesByCollection: (namespace, collection, params = {}) =>
    // FIXME HubAPI
    base.list(
      `v3/plugin/ansible/search/collection-versions/?dependency=${namespace}.${collection}`,
      params,
    ),

  list: (params?) => base.list(`content/ansible/collection_versions/`, params),

  move: (
    namespace: string,
    name: string,
    version: string,
    source_base_path: string,
    destination_base_path: string,
  ) =>
    // FIXME HubAPI
    base.http.post(
      `v3/collections/${namespace}/${name}/versions/${version}/move/${source_base_path}/${destination_base_path}/`,
      {},
    ),
};
