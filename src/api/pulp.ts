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
        const credentials = JSON.parse(
          window.sessionStorage.credentials ||
            window.localStorage.credentials ||
            '{}',
        );
        if (credentials?.username !== 'HACK') {
          request.auth = credentials;
        }
      }

      request.baseURL = config.API_BASE_PATH;
      request.headers['X-CSRFToken'] = Cookies.get('csrftoken');

      return request;
    });
  }
}
