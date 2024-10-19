import { PulpAPI } from './pulp';

class API extends PulpAPI {
  apiPath = 'tasks/purge/';
}

export const TaskPurgeAPI = new API();
