import { PulpAPI } from './pulp';

class API extends PulpAPI {
  apiPath = 'groups/';

  getUsers(id) {
    return this.http.get(`groups/${id}/users/`);
  }
  addUserToGroup(id, username) {
    return this.http.post(`groups/${id}/users/`, {
      username: username,
    });
  }
}

export const GroupAPI = new API();
