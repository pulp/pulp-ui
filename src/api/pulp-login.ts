import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const PulpLoginAPI = {
  get: () => base.http.get('login/'),
  // Here is the place to add more authentication methods for the login...
  login: (username: string, password: string) =>
    base.http.post('login/', {}, { auth: { username, password } }),
  logout: () => base.http.delete('login/'),
};
