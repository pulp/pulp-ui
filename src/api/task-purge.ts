import { PulpAPI } from './pulp';

export class API extends PulpAPI {
  apiPath = 'tasks/purge/';
}

export const TaskPurgeAPI = new API();
