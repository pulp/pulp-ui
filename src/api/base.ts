import axios from 'axios';
import Cookies from 'js-cookie';
import { config } from 'src/ui-config';
import { ParamHelper } from 'src/utilities';

export class BaseAPI {
  apiPath: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  http: any;
  sortParam: string; // translate ?sort into sortParam in list()
  mapPageToOffset: boolean;

  // a request URL is created from:
  // * API_BASE_PATH - pulp api prefix, ends in trailing slash
  // * apiPath - set by leaf API classes
  // any extra id or params added by custom methods
  constructor() {
    this.http = axios.create({
      // adapter + withCredentials ensures no popup on http basic auth fail
      adapter: 'fetch',
      withCredentials: false,

      // baseURL set to API_BASE_PATH in authHandler
      paramsSerializer: {
        serialize: (params) => ParamHelper.getQueryString(params),
      },
    });

    this.http.interceptors.request.use((request) => this.authHandler(request));
  }

  public mapParams(params) {
    const newParams = { ...params };

    if (this.mapPageToOffset) {
      // The api uses offset/limit OR page/page_size for pagination
      // the UI uses page/page size and maps to whatever the api expects

      const pageSize = parseInt(newParams['page_size'], 10) || 10;
      const page = parseInt(newParams['page'], 10) || 1;

      delete newParams['page'];
      delete newParams['page_size'];

      newParams['offset'] = page * pageSize - pageSize;
      newParams['limit'] = pageSize;
    }

    if (this.sortParam && newParams['sort'] && this.sortParam !== 'sort') {
      // The api uses sort/ordering/order_by for sort
      // the UI uses sort and maps to whatever the api expects

      newParams[this.sortParam] = newParams['sort'];
      delete newParams['sort'];
    }

    return {
      params: newParams,
    };
  }

  list(params?: object, apiPath?: string) {
    return this.http.get(this.getPath(apiPath), this.mapParams(params));
  }

  get(id: string, apiPath?: string) {
    return this.http.get(this.getPath(apiPath) + id + '/');
  }

  update(id: string | number, data, apiPath?: string) {
    return this.http.put(this.getPath(apiPath) + id + '/', data);
  }

  create(data, apiPath?: string) {
    return this.http.post(this.getPath(apiPath), data);
  }

  delete(id: string | number, apiPath?: string) {
    return this.http.delete(this.getPath(apiPath) + id + '/');
  }

  patch(id: string | number, data, apiPath?: string) {
    return this.http.patch(this.getPath(apiPath) + id + '/', data);
  }

  private getPath(apiPath?: string) {
    return apiPath || this.apiPath || '';
  }

  private async authHandler(request) {
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
  }
}
