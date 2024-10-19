import { PulpAPI } from './pulp';

class API extends PulpAPI {
  apiPath = 'orphans/cleanup/';
}

export const OrphanCleanupAPI = new API();
