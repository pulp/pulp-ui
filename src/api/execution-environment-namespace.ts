import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.sortParam = 'sort'; // FIXME

export const ExecutionEnvironmentNamespaceAPI = {
  addRole: (id, role) =>
    base.http.post(`pulp_container/namespaces/${id}/add_role/`, role),

  listRoles: (id, params?) =>
    base.list(`pulp_container/namespaces/${id}/list_roles/`, params),

  myPermissions: (id, params?) =>
    base.list(`pulp_container/namespaces/${id}/my_permissions/`, params),

  removeRole: (id, role) =>
    base.http.post(`pulp_container/namespaces/${id}/remove_role/`, role),
};
