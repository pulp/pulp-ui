import { PulpAPI } from './pulp';

export class DebRemoteType {
  architectures: string;
  ca_cert: string;
  client_cert: string;
  components: string;
  distributions: string;
  download_concurrency: number;
  gpgkey: string;
  ignore_missing_package_indices?: boolean;
  name: string;
  proxy_url: string;
  pulp_href?: string;
  rate_limit: number;
  sync_installer?: boolean;
  sync_sources?: boolean;
  sync_udebs?: boolean;
  tls_validation: boolean;
  url: string;

  // connect_timeout
  // headers
  // max_retries
  // policy
  // prn
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

// as in file-remote
function smartUpdate(remote: DebRemoteType, unmodifiedRemote: DebRemoteType) {
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

export const DebRemoteAPI = {
  create: (data) => base.http.post(`remotes/deb/apt/`, data),

  delete: (id) => base.http.delete(`remotes/deb/apt/${id}/`),

  get: (id) => base.http.get(`remotes/deb/apt/${id}/`),

  list: (params?) => base.list(`remotes/deb/apt/`, params),

  smartUpdate: (id, newValue: DebRemoteType, oldValue: DebRemoteType) =>
    base.http.put(`remotes/deb/apt/${id}/`, smartUpdate(newValue, oldValue)),
};
