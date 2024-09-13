import { PulpAPI } from './pulp';

export class API extends PulpAPI {
  try(username, password) {
    // roles = any api that will always be there and requires auth
    return this.http.get('roles/', { auth: { username, password } });
  }
}

export const PulpLoginAPI = new API();
