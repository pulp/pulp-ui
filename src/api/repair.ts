import { PulpAPI } from './pulp';

export class API extends PulpAPI {
  apiPath = 'repair/';
}

export const RepairAPI = new API();
