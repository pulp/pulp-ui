/**
 * Generic Resource shared across every Pulp resource.
 * 
 * @see https://github.com/pulp/pulpcore/blob/main/pulpcore/app/serializers/base.py
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

export type { GenericRepository }
