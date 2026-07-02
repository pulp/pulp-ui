/**
 * Generic PulpCore Exceptions based on dictionary representation.
 * @see https://github.com/pulp/pulpcore/blob/main/pulpcore/exceptions/base.py
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
 * @see https://github.com/pulp/pulpcore/blob/main/pulpcore/app/serializers/repository.py
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

export type { TaskErrorType, GenericRepository, GenericDistribution, GenericPublication };
