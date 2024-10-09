import { PulpAPI } from './pulp';

class API extends PulpAPI {
  get() {
    return super.get('');
  }
}

export const ApplicationInfoAPI = new API();
