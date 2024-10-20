import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'orphans/cleanup/';

export const OrphanCleanupAPI = {
  create: (data) => base.create(data),
};
