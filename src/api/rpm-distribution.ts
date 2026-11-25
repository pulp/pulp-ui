import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const RPMDistributionAPI = {
  create: (data) => base.http.post(`distributions/rpm/rpm/`, data),

  delete: (id) => base.http.delete(`distributions/rpm/rpm/${id}/`),

  list: (params?) => base.list(`distributions/rpm/rpm/`, params),
};
