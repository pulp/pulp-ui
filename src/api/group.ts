import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'groups/';

export const GroupAPI = {
  addUserToGroup: (id, username) =>
    base.http.post(`groups/${id}/users/`, {
      username: username,
    }),

  create: (data) => base.create(data),

  delete: (id) => base.delete(id),

  get: (id) => base.get(id),

  getUsers: (id) => base.http.get(`groups/${id}/users/`),

  list: (params?) => base.list(params),

  update: (id, data) => base.update(id, data),
};
