import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const GenericPulpAPI = {
  get: (url: string, params = {}) => base.http.get(url, base.mapParams(params)),
};
