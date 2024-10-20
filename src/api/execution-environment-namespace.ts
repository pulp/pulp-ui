import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'pulp_container/namespaces/';
base.sortParam = 'sort'; // FIXME

export const ExecutionEnvironmentNamespaceAPI = {
  addRole: (id, role) => base.create(role, base.apiPath + id + '/add_role/'),

  listRoles: (id, params?) =>
    base.list(params, base.apiPath + id + '/list_roles/'),

  myPermissions: (id, params?) =>
    base.list(params, base.apiPath + id + '/my_permissions/'),

  removeRole: (id, role) =>
    base.create(role, base.apiPath + id + '/remove_role/'),
};
