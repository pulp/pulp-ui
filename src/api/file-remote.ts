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

const base = new PulpAPI();

export const FileRemoteAPI = {
  create: (data) => base.http.post(`remotes/file/file/`, data),

  delete: (id) => base.http.delete(`remotes/file/file/${id}/`),

  get: (id) => base.http.get(`remotes/file/file/${id}/`),

  list: (params?) => base.list(`remotes/file/file/`, params),

  patch: (id, data) => base.http.patch(`remotes/file/file/${id}/`, data),
};
