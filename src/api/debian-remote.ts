import { PulpAPI } from './pulp';

// export class DebianRemoteType {
//   auth_url: string;
//   ca_cert: string;
//   client_cert: string;
//   download_concurrency: number;
//   name: string;
//   proxy_url: string;
//   pulp_href?: string;
//   rate_limit: number;
//   requirements_file: string;
//   tls_validation: boolean;
//   url: string;
//   signed_only: boolean;
//   sync_dependencies?: boolean;
//   components:string;
//   architectures:string;
//   distributions:string;
//   // connect_timeout
//   // headers
//   // max_retries
//   // policy
//   // pulp_created
//   // pulp_labels
//   // pulp_last_updated
//   // sock_connect_timeout
//   // sock_read_timeout
//   // total_timeout

//   hidden_fields: {
//     is_set: boolean;
//     name: string;
//   }[];

//   my_permissions?: string[];
// }


export interface DebianRemoteType {
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
  components: string;
  architectures: string;
  distributions: string;

  hidden_fields: {
    is_set: boolean;
    name: string;
  }[];

  my_permissions?: string[];
}


// simplified version of smartUpdate from execution-environment-registry
function smartUpdate(
  remote: DebianRemoteType,
  unmodifiedRemote: DebianRemoteType,
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

export const DebianRemoteAPI = {
  addRole: (id, role) =>
    base.http.post(`remotes/deb/apt/${id}/add_role/`, role),

  create: (data) => base.http.post(`remotes/deb/apt/`, data),

  delete: (id) => base.http.delete(`remotes/deb/apt/${id}/`),

  get: (id) => base.http.get(`remotes/deb/apt/${id}/`),

  list: (params?) => base.list(`remotes/deb/apt/`, params),

  read: (id: string) => base.http.get(`remotes/deb/apt/${id}/`),

  listRoles: (id, params?) =>
    base.list(`remotes/deb/apt/${id}/list_roles/`, params),

  myPermissions: (id, params?) =>
    base.list(`remotes/deb/apt/${id}/my_permissions/`, params),

  removeRole: (id, role) =>
    base.http.post(`remotes/deb/apt/${id}/remove_role/`, role),

  smartUpdate: (id, newValue: DebianRemoteType, oldValue: DebianRemoteType) =>
    base.http.put(
      `remotes/deb/apt/${id}/`,
      smartUpdate(newValue, oldValue),
    ),
};
