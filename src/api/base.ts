import axios from 'axios';
import { ParamHelper } from 'src/utilities';

export class BaseAPI {
  apiPath: string;
  http: { delete; get; interceptors; patch; post; put };
  sortParam: string; // translate ?sort into sortParam in list()
  mapPageToOffset: boolean;

  constructor() {
    this.http = axios.create({
      // adapter + withCredentials ensures no popup on http basic auth fail
      adapter: 'fetch',
      withCredentials: false,

      // baseURL gets set in PulpAPI
      paramsSerializer: {
        serialize: (params) => ParamHelper.getQueryString(params),
      },
    });
  }

  mapParams(params) {
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

  getPath(apiPath?: string) {
    return apiPath || this.apiPath || '';
  }
}
