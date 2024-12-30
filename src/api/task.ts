import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const TaskAPI = {
  get: (id) => base.http.get(`tasks/${id}/`),

  list: (params?) => base.list(`tasks/`, params),

  patch: (id, data) => base.http.patch(`tasks/${id}/`, data),
};
