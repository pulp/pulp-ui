import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const PulpStatusAPI = {
  get: () => base.http.get('status/'),
};
