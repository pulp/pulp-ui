import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = '_ui/v1/imports/collections/';

export const ImportAPI = {
  get: (id) => base.get(id),

  list: (params?) => base.list(params),
};
