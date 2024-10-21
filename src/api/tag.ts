import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const TagAPI = {
  listCollections: (params) => base.list(`_ui/v1/tags/collections/`, params),

  listRoles: (params) => base.list(`_ui/v1/tags/roles/`, params),
};
