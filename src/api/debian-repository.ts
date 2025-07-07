import { PulpAPI } from './pulp';
import { type LastSyncType } from './response-types/remote';

export class DebianRepositoryType {
  description: string;
  last_sync_task?: LastSyncType;
  latest_version_href?: string;
  name: string;
  private?: boolean;
  pulp_created?: string;
  pulp_href?: string;
  pulp_labels?: Record<string, string>;
  remote?: string;
  retain_repo_versions: number;

  // gpgkey
  // last_synced_metadata_time
  // versions_href

  my_permissions?: string[];
}

const base = new PulpAPI();

export const DebianRepositoryAPI = {
  addContent: (id: string, collection_version_hrefs) =>
    base.http.post(`repositories/deb/apt/${id}/modify/`, {
      add_content_units: collection_version_hrefs,
    }),

  addRole: (id: string, role) =>
    base.http.post(`repositories/deb/apt/${id}/add_role/`, role),

  copyCollectionVersion: (
    id: string,
    body: {
      collection_versions: string[];
      destination_repositories: string[];
      signing_service?: string;
    },
  ) =>
    base.http.post(
      `repositories/deb/apt/${id}/copy_collection_version/`,
      body,
    ),

  create: (data) => base.http.post(`repositories/deb/apt/`, data),

  delete: (id) => base.http.delete(`repositories/deb/apt/${id}/`),

  list: (params?) => base.list(`repositories/deb/apt/`, params),

  listRoles: (id: string, params?) =>
    base.list(`repositories/deb/apt/${id}/list_roles/`, params),

  listVersions: (id: string, params?) =>
    base.list(`repositories/deb/apt/${id}/versions/`, params),

  moveCollectionVersion: (
    id: string,
    body: {
      collection_versions: string[];
      destination_repositories: string[];
      signing_service?: string;
    },
  ) =>
    base.http.post(
      `repositories/deb/apt/${id}/move_collection_version/`,
      body,
    ),

  myPermissions: (id: string, params?) =>
    base.list(`repositories/deb/apt/${id}/my_permissions/`, params),

  removeContent: (id: string, collection_version_href) =>
    base.http.post(`repositories/deb/apt/${id}/modify/`, {
      remove_content_units: [collection_version_href],
    }),

  removeRole: (id: string, role) =>
    base.http.post(`repositories/deb/apt/${id}/remove_role/`, role),

  revert: (id: string, version_href) =>
    base.http.post(`repositories/deb/apt/${id}/modify/`, {
      base_version: version_href,
    }),

  sync: (id: string, body = {}) =>
    base.http.post(`repositories/deb/apt/${id}/sync/`, body),

  update: (id: string, data) =>
    base.http.put(`repositories/deb/apt/${id}/`, data),
};
