import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const PythonDistributionAPI = {
  create: (data) => base.http.post(`distributions/python/pypi/`, data),

  delete: (id) => base.http.delete(`distributions/python/pypi/${id}/`),

  list: (params?) => base.list(`distributions/python/pypi/`, params),
};
