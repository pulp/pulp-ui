import type { GenericRepository, TaskErrorType } from './common';
import { PulpAPI } from './pulp';
import type { PulpStatus } from './response-types/pulp';

/**
 * Last Sync Task Type.
 *
 * @see https://github.com/pulp/pulp_ansible/blob/main/pulp_ansible/app/utils.py
 */
interface LastSyncType {
  pk: string;
  state: PulpStatus;
  pulp_created: string;
  finished_at: string | null;
  error: TaskErrorType | null;
}

/**
 * Ansible Repository Type.
 *
 * @see https://github.com/pulp/pulp_ansible/blob/main/pulp_ansible/app/serializers.py
 */
interface AnsibleRepositoryType extends GenericRepository {
  last_synced_metadata_time?: string | null;
  gpgkey?: string | null;
  readonly last_sync_task?: LastSyncType | null;
  private?: boolean;
  /**
   * NOTE: Not part of the Ansible serializer, populated separately. 
   * This should be broken out into its own type and extend the interface.
   */
  my_permissions?: string[];
}

const base = new PulpAPI();

export const AnsibleRepositoryAPI = {
  addContent: (id: string, collection_version_hrefs) =>
    base.http.post(`repositories/ansible/ansible/${id}/modify/`, {
      add_content_units: collection_version_hrefs,
    }),

  addRole: (id: string, role) =>
    base.http.post(`repositories/ansible/ansible/${id}/add_role/`, role),

  copyCollectionVersion: (
    id: string,
    body: {
      collection_versions: string[];
      destination_repositories: string[];
      signing_service?: string;
    },
  ) =>
    base.http.post(
      `repositories/ansible/ansible/${id}/copy_collection_version/`,
      body,
    ),

  create: (data) => base.http.post(`repositories/ansible/ansible/`, data),

  delete: (id) => base.http.delete(`repositories/ansible/ansible/${id}/`),

  list: (params?) => base.list(`repositories/ansible/ansible/`, params),

  listRoles: (id: string, params?) =>
    base.list(`repositories/ansible/ansible/${id}/list_roles/`, params),

  listVersions: (id: string, params?) =>
    base.list(`repositories/ansible/ansible/${id}/versions/`, params),

  moveCollectionVersion: (
    id: string,
    body: {
      collection_versions: string[];
      destination_repositories: string[];
      signing_service?: string;
    },
  ) =>
    base.http.post(
      `repositories/ansible/ansible/${id}/move_collection_version/`,
      body,
    ),

  myPermissions: (id: string, params?) =>
    base.list(`repositories/ansible/ansible/${id}/my_permissions/`, params),

  removeContent: (id: string, collection_version_href) =>
    base.http.post(`repositories/ansible/ansible/${id}/modify/`, {
      remove_content_units: [collection_version_href],
    }),

  removeRole: (id: string, role) =>
    base.http.post(`repositories/ansible/ansible/${id}/remove_role/`, role),

  revert: (id: string, version_href) =>
    base.http.post(`repositories/ansible/ansible/${id}/modify/`, {
      base_version: version_href,
    }),

  sync: (id: string, body = {}) =>
    base.http.post(`repositories/ansible/ansible/${id}/sync/`, body),

  update: (id: string, data) =>
    base.http.put(`repositories/ansible/ansible/${id}/`, data),
};

export type { AnsibleRepositoryType };
