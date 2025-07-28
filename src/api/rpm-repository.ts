import { PulpAPI } from './pulp';

export class RPMRepositoryType {
  autopublish?: boolean;
  checksum_type?: 'sha1' | 'sha256' | 'sha512';
  description: string | null;
  gpgcheck?: 0 | 1 | 2;
  latest_version_href?: string;
  metadata_signing_service?: string;
  name: string;
  pulp_created?: string;
  pulp_href?: string;
  pulp_labels: Record<string, string>;
  pulp_last_updated?: string;
  remote: string | null;
  repoclosure_verification?: boolean;
  repo_gpgcheck?: 0 | 1;
  retain_package_versions?: number;
  retain_repo_versions: number | null;
  versions_href?: string;
}

const base = new PulpAPI();

export const RPMRepositoryAPI = {
  create: (data) => base.http.post(`repositories/rpm/rpm/`, data),

  delete: (id) => base.http.delete(`repositories/rpm/rpm/${id}/`),

  list: (params?) => base.list(`repositories/rpm/rpm/`, params),

  listVersions: (id: string, params?) =>
    base.list(`repositories/rpm/rpm/${id}/versions/`, params),

  revert: (id: string, version_href) =>
    base.http.post(`repositories/rpm/rpm/${id}/modify/`, {
      base_version: version_href,
    }),

  sync: (id: string, body = {}) =>
    base.http.post(`repositories/rpm/rpm/${id}/sync/`, body),

  update: (id: string, data) =>
    base.http.put(`repositories/rpm/rpm/${id}/`, data),
};
