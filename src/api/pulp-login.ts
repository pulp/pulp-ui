import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const PulpLoginAPI = {
  try: (username, password) =>
    // groups = any api that will always be there and requires auth
    base.http.get(`groups/`, {
      auth: { username, password },
      params: { limit: 0, offset: 0 },
    }),
};
