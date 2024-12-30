import { PulpAPI } from './pulp';

export class AnsibleRemoteType {
  auth_url: string;
  ca_cert: string;
  client_cert: string;
  download_concurrency: number;
  name: string;
  proxy_url: string;
  pulp_href?: string;
  rate_limit: number;
  requirements_file: string;
  tls_validation: boolean;
  url: string;
  signed_only: boolean;
  sync_dependencies?: boolean;

  // connect_timeout
  // headers
  // max_retries
  // policy
  // pulp_created
  // pulp_labels
  // pulp_last_updated
  // sock_connect_timeout
  // sock_read_timeout
  // total_timeout

  hidden_fields: {
    is_set: boolean;
    name: string;
  }[];

  my_permissions?: string[];
}

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

export const AnsibleRemoteAPI = {
  addRole: (id, role) =>
    base.http.post(`remotes/ansible/collection/${id}/add_role/`, role),

  create: (data) => base.http.post(`remotes/ansible/collection/`, data),

  delete: (id) => base.http.delete(`remotes/ansible/collection/${id}/`),

  get: (id) => base.http.get(`remotes/ansible/collection/${id}/`),

  list: (params?) => base.list(`remotes/ansible/collection/`, params),

  listRoles: (id, params?) =>
    base.list(`remotes/ansible/collection/${id}/list_roles/`, params),

  myPermissions: (id, params?) =>
    base.list(`remotes/ansible/collection/${id}/my_permissions/`, params),

  removeRole: (id, role) =>
    base.http.post(`remotes/ansible/collection/${id}/remove_role/`, role),

  smartUpdate: (id, newValue: AnsibleRemoteType, oldValue: AnsibleRemoteType) =>
    base.http.put(
      `remotes/ansible/collection/${id}/`,
      smartUpdate(newValue, oldValue),
    ),
};
