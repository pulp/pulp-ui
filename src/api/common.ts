import type { PulpStatus } from "./response-types/pulp";

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

/**
 * --------------------
 * Shared types reused across multiple resource types but not part of pulpcore generic types.
 * --------------------
 */

/**
 * Last Sync Task Type.
 * 
 * @see https://github.com/pulp/pulp_ansible/blob/main/pulp_ansible/app/utils.py
 */
interface LastSyncType {
    pk: string;
    state: PulpStatus;
    pulp_created: string;
    finished_at: string;
    error: TaskErrorType;
}

export type { TaskErrorType, GenericRepository, LastSyncType }
