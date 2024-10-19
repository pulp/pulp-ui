import { PulpAPI } from './pulp';

class API extends PulpAPI {
  // base get adds a trailing slash
  get(url: string, params = {}) {
    return this.http.get(url, this.mapParams(params));
  }
}

export const GenericPulpAPI = new API();
