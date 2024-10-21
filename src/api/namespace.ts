import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const NamespaceAPI = {
  create: (data) => base.http.post(`_ui/v1/namespaces/`, data),

  delete: (id) => base.http.delete(`_ui/v1/namespaces/${id}/`),

  get: (id: string, params = {}) =>
    base.http.get(`_ui/v1/namespaces/${id}/`, { params }),

  list: (params?) => base.list(`_ui/v1/namespaces/`, params),

  update: (id, data) => base.http.put(`_ui/v1/namespaces/${id}/`, data),
};
