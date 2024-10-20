import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = '_ui/v1/namespaces/';

export const NamespaceAPI = {
  create: (data) => base.create(data),

  delete: (id) => base.delete(id),

  get: (id: string, params = {}) =>
    base.http.get(base.apiPath + id + '/', { params }),

  list: (params?) => base.list(params),

  update: (id, data) => base.update(id, data),
};
