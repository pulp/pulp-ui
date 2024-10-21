import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const ImportAPI = {
  get: (id) => base.http.get(`_ui/v1/imports/collections/${id}/`),

  list: (params?) => base.list(`_ui/v1/imports/collections/`, params),
};
