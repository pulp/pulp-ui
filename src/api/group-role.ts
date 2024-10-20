import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'groups/';

export const GroupRoleAPI = {
  addRoleToGroup: (groupId, role) =>
    base.http.post(base.apiPath + `${groupId}/roles/`, {
      role: role.name,
      // required field, can be empty
      content_object: null,
    }),

  listRoles: (groupId, params?) =>
    base.list(params, base.apiPath + `${groupId}/roles/`),

  removeRole: (groupId, roleId) =>
    base.http.delete(base.apiPath + `${groupId}/roles/${roleId}/`),
};
