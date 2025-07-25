import { PulpAPI } from './pulp';

export class RPMRemoteType {
  ca_cert: string;
  client_cert: string;
  download_concurrency: number;
  name: string;
  proxy_url: string;
  proxy_username: string;
  proxy_password: string;
  pulp_href?: string;
  rate_limit: number;
  tls_validation: boolean;
  url: string;
  username: string;
  password: string;
  max_retries: number;
  policy?: 'immediate' | 'on_demand' | 'streamed';
  pulp_labels?: Record<string, string>;
  total_timeout?: number;
  connect_timeout?: number;
  sock_connect_timeout?: number;
  sock_read_timeout?: number;
  headers?: Record<string, string>;
  sles_auth_token?: string;

  hidden_fields: {
    is_set: boolean;
    name: string;
  }[];
}

// simplified version of smartUpdate from execution-environment-registry
function smartUpdate(remote: RPMRemoteType, unmodifiedRemote: RPMRemoteType) {
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

export const RPMRemoteAPI = {
  create: (data) => base.http.post(`remotes/rpm/rpm/`, data),

  delete: (id) => base.http.delete(`remotes/rpm/rpm/${id}/`),

  get: (id) => base.http.get(`remotes/rpm/rpm/${id}/`),

  list: (params?) => base.list(`remotes/rpm/rpm/`, params),

  smartUpdate: (id, newValue: RPMRemoteType, oldValue: RPMRemoteType) =>
    base.http.put(`remotes/rpm/rpm/${id}/`, smartUpdate(newValue, oldValue)),
};
