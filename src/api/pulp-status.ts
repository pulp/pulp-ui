import { PulpAPI } from './pulp';

class API extends PulpAPI {
  get() {
    return this.http.get('status/');
  }
}

export const PulpStatusAPI = new API();
