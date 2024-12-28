import axios from 'axios';
import { ParamHelper } from 'src/utilities';

export class BaseAPI {
  http: { delete; get; interceptors; patch; post; put };
  sortParam: string; // translate ?sort into sortParam in list()
  mapPageToOffset: boolean;

  constructor() {
    this.http = axios.create({
      // API_BASE_PATH gets set in pulp.ts.
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFToken',
      // This is what prevents Pulp from sending the "WWW-Authenticat: Basic *" header.
      // In turn, firefox will not be asking for a password.
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
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

  list(url: string, params?) {
    return this.http.get(url, this.mapParams(params));
  }
}
