import { PulpAPI } from './pulp';

const base = new PulpAPI();

// FIXME HubAPI
export const TagAPI = {
  listCollections: (params) => base.list(`_ui/v1/tags/collections/`, params),

  listRoles: (params) => base.list(`_ui/v1/tags/roles/`, params),
};
