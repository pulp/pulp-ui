import { PulpAPI } from './pulp';

export class API extends PulpAPI {
  apiPath = 'users/';

  // create(user)
  // delete(id)
  // get(id)
  // list(params)
  // patch(id, user)
  // update(id, user)

  saveUser(user) {
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

    return UserAPI.patch(user.id, newUser);
  }
}

export const UserAPI = new API();
