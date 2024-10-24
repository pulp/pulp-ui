import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const PulpLoginAPI = {
  try: (username, password) =>
    // roles = any api that will always be there and requires auth
    base.http.get(`roles/`, { auth: { username, password } }),
};
