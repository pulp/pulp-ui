import { PulpAPI } from './pulp';

export class RPMRepositoryType {
  autopublish?: boolean;
  description: string | null;
  latest_version_href?: string;
  metadata_signing_service?: string;
  package_signing_service?: string;
  package_signing_fingerprint?: string;
  checksum_type?: 'unknown' | 'md5' | 'sha1' | 'sha224' |'sha256' | 'sha384' | 'sha512';
  name: string;
  pulp_created?: string;
  pulp_href?: string;
  pulp_labels?: Record<string, string>;
  pulp_last_updated?: string;
  remote?: string | null;
  repoclosure_verification?: boolean;
  retain_package_versions?: number;
  retain_repo_versions?: number | null;
  versions_href?: string;
  compression_type?: 'zstd' | 'gz';
  repo_config?: object;
  layout?: 'nested_alphabetically' | 'flat';
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
