import { config } from 'src/ui-config';
import { BaseAPI } from './base';

export class PulpAPI extends BaseAPI {
  mapPageToOffset = true; // offset & limit
  sortParam = 'ordering';

  constructor() {
    super();

    this.http.interceptors.request.use((request) => {
      // This is kind of delayed, because the settings promise may be evaluated later.
      // In search for a better solution.
      request.baseURL = config.API_BASE_PATH;

      return request;
    });
  }
}
