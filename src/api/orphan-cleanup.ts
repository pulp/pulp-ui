import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const OrphanCleanupAPI = {
  create: (data) => base.http.post(`orphans/cleanup/`, data),
};
