import { PulpAPI } from './pulp';

export class FileRemoteType {
  ca_cert: string;
  client_cert: string;
  download_concurrency: number;
  name: string;
  proxy_url: string;
  pulp_href?: string;
  rate_limit: number;
  tls_validation: boolean;
  url: string;
  sync_dependencies?: boolean;

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

// simplified version of smartUpdate from execution-environment-registry
function smartUpdate(remote: FileRemoteType, unmodifiedRemote: FileRemoteType) {
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

export const FileRemoteAPI = {
  create: (data) => base.http.post(`remotes/file/file/`, data),

  delete: (id) => base.http.delete(`remotes/file/file/${id}/`),

  get: (id) => base.http.get(`remotes/file/file/${id}/`),

  list: (params?) => base.list(`remotes/file/file/`, params),

  smartUpdate: (id, newValue: FileRemoteType, oldValue: FileRemoteType) =>
    base.http.put(`remotes/file/file/${id}/`, smartUpdate(newValue, oldValue)),
};
