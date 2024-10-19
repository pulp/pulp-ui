import { PulpAPI } from './pulp';

class API extends PulpAPI {
  last_status = null;
  last_status_time = 0;

  private _get() {
    return this.http.get('status/');
  }

  get() {
    this.last_status_time = Date.now();
    this.last_status = this._get();
    return this.last_status;
  }

  cache() {
    if (!this.last_status || this.last_status_time + 300000 < Date.now()) {
      return this.get();
    }
    return this.last_status;
  }
}

export const PulpStatusAPI = new API();
