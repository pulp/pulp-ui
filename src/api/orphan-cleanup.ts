import { PulpAPI } from './pulp';

export class API extends PulpAPI {
  apiPath = 'orphans/cleanup/';
}

export const OrphanCleanupAPI = new API();
