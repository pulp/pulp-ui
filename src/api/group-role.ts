import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const GroupRoleAPI = {
  addRoleToGroup: (groupId, role) =>
    base.http.post(`groups/${groupId}/roles/`, {
      role: role.name,
      // required field, can be empty
      content_object: null,
    }),

  listRoles: (groupId, params?) =>
    base.list(`groups/${groupId}/roles/`, params),

  removeRole: (groupId, roleId) =>
    base.http.delete(`groups/${groupId}/roles/${roleId}/`),
};
