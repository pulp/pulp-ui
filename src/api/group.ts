import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const GroupAPI = {
  addUserToGroup: (id, username) =>
    base.http.post(`groups/${id}/users/`, {
      username: username,
    }),

  create: (data) => base.http.post(`groups/`, data),

  delete: (id) => base.http.delete(`groups/${id}/`),

  get: (id) => base.http.get(`groups/${id}/`),

  getUsers: (id) => base.http.get(`groups/${id}/users/`),

  list: (params?) => base.list(`groups/`, params),

  update: (id, data) => base.http.put(`groups/${id}/`, data),
};
