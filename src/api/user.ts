import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const UserAPI = {
  create: (user) => base.http.post(`users/`, user),

  delete: (id) => base.http.delete(`users/${id}/`),

  get: (id) => base.http.get(`users/${id}/`),

  list: (params?) => base.list(`users/`, params),

  patch: (id, user) => base.http.patch(`users/${id}/`, user),

  saveUser: (user) => {
    const newUser = { ...user };

    // do not reset password when not trying to change it
    if (!newUser.password) {
      delete newUser.password;
    }

    // delete non-editable fields
    delete newUser.date_joined;
    delete newUser.hidden_fields;
    delete newUser.id;
    delete newUser.is_active;
    delete newUser.is_staff;
    delete newUser.prn;
    delete newUser.pulp_href;

    return base.http.patch(`users/${user.id}/`, newUser);
  },

  update: (id, user) => base.http.put(`users/${id}/`, user),
};
