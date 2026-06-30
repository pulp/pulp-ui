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
    readonly pulp_labels?: Record<string, string>;
    readonly versions_href?: string;
    readonly latest_version_href?: string;
    readonly name: string;
    readonly description: string | null;
    readonly retain_repo_versions: string | null;
    readonly retain_checkpoints: string | null;
    readonly remote: string | null;
}

export type { GenericRepository }
