import { PulpAPI } from './pulp';
import { type AnsibleRemoteType } from './response-types/ansible-remote';

// simplified version of smartUpdate from execution-environment-registry
function smartUpdate(
  remote: AnsibleRemoteType,
  unmodifiedRemote: AnsibleRemoteType,
) {
  // Pulp complains if auth_url gets sent with a request that doesn't include a
  // valid token, even if the token exists in the database and isn't being changed.
  // To solve this issue, simply delete auth_url from the request if it hasn't
  // been updated by the user.
  if (remote.auth_url === unmodifiedRemote.auth_url) {
    delete remote.auth_url;
  }

  for (const field of Object.keys(remote)) {
    if (remote[field] === '') {
      remote[field] = null;
    }

    // API returns headers:null bull doesn't accept it .. and we don't edit headers
    if (remote[field] === null && unmodifiedRemote[field] === null) {
      delete remote[field];
    }
  }

  return remote;
}

const base = new PulpAPI();
base.apiPath = 'remotes/ansible/collection/';

export const AnsibleRemoteAPI = {
  addRole: (id, role) => base.create(role, base.apiPath + id + '/add_role/'),

  create: (data) => base.create(data),

  delete: (id) => base.delete(id),

  get: (id) => base.get(id),

  list: (params?) => base.list(params),

  listRoles: (id, params?) =>
    base.list(params, base.apiPath + id + '/list_roles/'),

  myPermissions: (id, params?) =>
    base.list(params, base.apiPath + id + '/my_permissions/'),

  removeRole: (id, role) =>
    base.create(role, base.apiPath + id + '/remove_role/'),

  smartUpdate: (id, newValue: AnsibleRemoteType, oldValue: AnsibleRemoteType) =>
    base.update(id, smartUpdate(newValue, oldValue)),
};
