import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const FileDistributionAPI = {
  create: (data) => base.http.post(`distributions/file/file/`, data),

  delete: (id) => base.http.delete(`distributions/file/file/${id}/`),

  list: (params?) => base.list(`distributions/file/file/`, params),
};
