import { PulpAPI } from './pulp';

const base = new PulpAPI();

export interface ContainerRemoteNativeType {
  pulp_href: string;
  name: string;
  url: string;
  pulp_created: string;
  pulp_last_updated: string;
  policy: string;
  tls_validation: boolean;
  proxy_url: string | null;
  ca_cert: string | null;
  client_cert: string | null;
  hidden_fields: { name: string; is_set: boolean }[];
}

export const ContainerRemoteNativeAPI = {
  get: (id: string) => base.http.get(`remotes/container/container/${id}/`),

  list: (params?) => base.list('remotes/container/container/', params),
};
