import type { PulpStatus } from './response-types/pulp';

/**
 * Generic PulpCore Exceptions based on dictionary representation.
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulpcore/exceptions/base.py#L37
 */
interface TaskErrorType {
  description: string;
  traceback: string | null;
  error_code?: string;
}

/**
 * Generic Resource shared across every Pulp resource.
 *
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulpcore/app/serializers/base.py#L448
 */
interface GenericResource {
  readonly pulp_href?: string;
  readonly prn?: string;
  readonly pulp_created?: string;
  readonly pulp_last_updated?: string;
}

/**
 * Generic Repository shared across Pulp Repository plugins.
 *
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulpcore/app/serializers/repository.py#L26
 */
interface GenericRepository extends GenericResource {
  pulp_labels?: Record<string, string>;
  readonly versions_href?: string;
  readonly latest_version_href?: string;
  name: string;
  description?: string | null;
  retain_repo_versions?: number | null;
  retain_checkpoints?: number | null;
  remote?: string | null;
}

/**
 * Generic Distribution shared across Pulp Distribution plugins.
 *
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulpcore/app/serializers/publication.py
 */
interface GenericDistribution extends GenericResource {
  base_path: string;
  readonly base_url?: string;
  content_guard?: string | null;
  readonly content_guard_prn?: string | null;
  readonly no_content_change_since?: string | null;
  hidden?: boolean;
  pulp_labels?: Record<string, string>;
  name: string;
  repository?: string;
  repository_version?: string;
}

/**
 * Generic Publication shared across Pulp Publication plugins.
 *
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulpcore/app/serializers/publication.py#L23
 */
interface GenericPublication extends GenericResource {
  repository_version?: string;
  repository?: string;
}

/**
 * Generic Remote shared across Pulp Remote plugins.
 *
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulpcore/app/serializers/repository.py#L85
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulpcore/app/serializers/base.py#L612
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulpcore/app/serializers/base.py#L367
 */
interface GenericRemote extends GenericResource {
  pulp_labels?: Record<string, string>;
  name: string;
  url: string;
  policy?: string;
  readonly hidden_fields?: { name: string; is_set: boolean }[];
  ca_cert?: string | null;
  client_cert?: string | null;
  client_key?: string | null;
  tls_validation?: boolean;
  proxy_url?: string | null;
  proxy_username?: string | null;
  proxy_password?: string | null;
  username?: string | null;
  password?: string | null;
  max_retries?: number | null;
  total_timeout?: number | null;
  connect_timeout?: number | null;
  sock_connect_timeout?: number | null;
  sock_read_timeout?: number | null;
  headers?: unknown[];
  download_concurrency?: number | null;
  rate_limit?: number | null;
}

/**
 * --------------------
 * These are shared Plugin Types outside the PulpCore Generics.
 * --------------------
 */

/**
 * Last Sync Task Type.
 *
 * @see https://github.com/pulp/pulp_ansible/blob/0043923641fc7fd3893f8489fd29ff04addc9d71/pulp_ansible/app/utils.py#L47
 */
interface AnsibleLastSyncType {
  pk: string;
  state: PulpStatus;
  pulp_created: string;
  finished_at: string | null;
  error: TaskErrorType | null;
}

export type {
  TaskErrorType,
  GenericRepository,
  GenericDistribution,
  GenericPublication,
  GenericRemote,
  AnsibleLastSyncType,
};
