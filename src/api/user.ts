import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'users/';

export const UserAPI = {
  create: (user) => base.create(user),

  delete: (id) => base.delete(id),

  get: (id) => base.get(id),

  list: (params?) => base.list(params),

  patch: (id, user) => base.patch(id, user),

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

    return base.patch(user.id, newUser);
  },

  update: (id, user) => base.update(id, user),
};
