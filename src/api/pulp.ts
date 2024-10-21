import Cookies from 'js-cookie';
import { config } from 'src/ui-config';
import { BaseAPI } from './base';

export class PulpAPI extends BaseAPI {
  mapPageToOffset = true; // offset & limit
  sortParam = 'ordering';

  constructor() {
    super();

    this.http.interceptors.request.use((request) => {
      if (!request.auth) {
        request.auth = JSON.parse(
          window.sessionStorage.credentials ||
            window.localStorage.credentials ||
            '{}',
        );
      }

      request.baseURL = config.API_BASE_PATH;
      request.headers['X-CSRFToken'] = Cookies.get('csrftoken');

      return request;
    });
  }
}
