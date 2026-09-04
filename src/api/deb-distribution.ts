import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const DebDistributionAPI = {
  create: (data) => base.http.post(`distributions/deb/apt/`, data),

  delete: (id) => base.http.delete(`distributions/deb/apt/${id}/`),

  list: (params?) => base.list(`distributions/deb/apt/`, params),
};
