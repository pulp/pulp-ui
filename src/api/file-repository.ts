import type { GenericRepository } from './common';
import { PulpAPI } from './pulp';

/**
 * Type for syncing metadata set on FileRepository after each sync.
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulp_file/app/tasks/synchronizing.py#L97
 */
interface FileLastSyncDetailsType {
  remote_pk: string;
  url: string;
  download_policy: string;
  mirror: boolean;
  most_recent_version: number;
  manifest_checksum: string;
}

/**
 * File Repository Type.
 *
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulp_file/app/serializers.py#L122
 */
interface FileRepositoryType extends GenericRepository {
  autopublish?: boolean;
  manifest?: string | null;
  readonly last_sync_details?: FileLastSyncDetailsType | null;
}

const base = new PulpAPI();

export const FileRepositoryAPI = {
  create: (data) => base.http.post(`repositories/file/file/`, data),

  delete: (id) => base.http.delete(`repositories/file/file/${id}/`),

  list: (params?) => base.list(`repositories/file/file/`, params),

  listVersions: (id: string, params?) =>
    base.list(`repositories/file/file/${id}/versions/`, params),

  revert: (id: string, version_href) =>
    base.http.post(`repositories/file/file/${id}/modify/`, {
      base_version: version_href,
    }),

  sync: (id: string, body = {}) =>
    base.http.post(`repositories/file/file/${id}/sync/`, body),

  update: (id: string, data) =>
    base.http.put(`repositories/file/file/${id}/`, data),
};

export type { FileRepositoryType };
