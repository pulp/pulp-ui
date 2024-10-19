import { PulpAPI } from './pulp';

class API extends PulpAPI {
  apiPath = 'repair/';
}

export const RepairAPI = new API();
