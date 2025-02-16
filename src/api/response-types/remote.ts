import { type PulpStatus } from './pulp';

export class LastSyncType {
  state: PulpStatus;
  started_at: string;
  finished_at: string;
  error: {
    traceback: string;
    description: string;
  };
}

export class RemoteType {
  id: string;
  pulp_href: string;
  name: string;
  url: string;
  signed_only: boolean;
  auth_url: string;
  rate_limit: number;
  token?: string;
  policy: string;
  requirements_file: string;
  updated_at: string;
  created_at: string;
  username: string;
  password?: string;
  proxy_url?: string;
  proxy_password?: string;
  proxy_username?: string;
  tls_validation?: boolean;
  client_key?: string;
  client_cert?: string;
  ca_cert?: string;
  sync_dependencies?: boolean;

  hidden_fields: { name: string; is_set: boolean }[];

  repositories: {
    name: string;
    description: string;
    last_sync_task: LastSyncType;
    distributions: {
      name: string;
      base_path: string;
    }[];
  }[];
  last_sync_task: LastSyncType;
  download_concurrency: number;
}
