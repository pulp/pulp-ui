import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = '_ui/v1/tags/';

export const TagAPI = {
  listCollections: (params) => base.list(params, base.apiPath + 'collections/'),

  listRoles: (params) => base.list(params, base.apiPath + 'roles/'),
};
