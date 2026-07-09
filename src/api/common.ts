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
 * Generic Filters shared across PulpCore & Plugin Endpoints.
 *
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulpcore/filters.py#L290
 */
interface GenericFilterParams {
  pulp_id__in?: string;
  pulp_href__in?: string;
  prn__in?: string;
  q?: string;
  exclude_fields?: string;
  fields?: string;
  limit?: number;
  minimal?: boolean;
  offset?: number;
  page_size?: number;
  ordering?: string;
  format?: string;
}

type LookupFilterParams<
  Field extends string,
  Lookup extends string,
  Value,
> = Partial<Record<Field | `${Field}__${Lookup}`, Value>>;
type NameFilterOptions =
  | 'iexact'
  | 'in'
  | 'contains'
  | 'icontains'
  | 'startswith'
  | 'istartswith'
  | 'regex'
  | 'iregex';
type NullableNumericFilterOptions =
  | 'ne'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'range'
  | 'isnull';
type NameFilterParams = LookupFilterParams<'name', NameFilterOptions, string>;
type RetainRepoVersionsFilterParams = LookupFilterParams<
  'retain_repo_versions',
  NullableNumericFilterOptions,
  number | string
>;
type RetainCheckpointsFilterParams = LookupFilterParams<
  'retain_checkpoints',
  NullableNumericFilterOptions,
  number | string
>;

/**
 * Generic Repository Filters shared across PulpCore & Plugin Endpoints.
 * 
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulpcore/app/viewsets/repository.py#L88
 */
interface GenericRepositoryFilterParams
  extends
    GenericFilterParams,
    NameFilterParams,
    RetainRepoVersionsFilterParams,
    RetainCheckpointsFilterParams {
  pulp_label_select?: string;
  remote?: string | null;
  with_content?: string;
  latest_with_content?: string;
}

/**
 * Generic Paginated Response shared across PulpCore & Plugin Endpoints.
 * 
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulpcore/app/settings.py#L186
 * @see https://github.com/encode/django-rest-framework/blob/6f0b74def3fcc81e126b87b08e59abdb6c2ad056/rest_framework/pagination.py#L364
 */
interface GenericPaginatedResponse<TResult> {
  count: number;
  next: string | null;
  previous: string | null;
  results: TResult[];
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
  GenericRepositoryFilterParams,
  GenericPaginatedResponse,
  AnsibleLastSyncType,
};
