import { PulpAPI } from './pulp';

export class API extends PulpAPI {
  apiPath = 'users/';
}

export const UserAPI = new API();
