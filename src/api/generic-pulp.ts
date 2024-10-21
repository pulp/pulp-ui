import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const GenericPulpAPI = {
  get: (url: string) => base.http.get(url),

  list: (url: string, params = {}) => base.list(url, params),
};
