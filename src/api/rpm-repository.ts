import type { GenericRepository } from './common';
import { PulpAPI } from './pulp';

type RPMChecksumType =
  | 'unknown'
  | 'md5'
  | 'sha'
  | 'sha1'
  | 'sha224'
  | 'sha256'
  | 'sha384'
  | 'sha512';
type RPMCompressionType = 'zstd' | 'gz' | 'none';
type RPMLayoutType = 'nested_alphabetically' | 'flat' | 'nested_by_digest';

/**
 * RPM Repository Type.
 *
 * @see https://github.com/pulp/pulp_rpm/blob/main/pulp_rpm/app/serializers/repository.py
 */
interface RPMRepositoryType extends GenericRepository {
  autopublish?: boolean;
  metadata_signing_service?: string | null;
  package_signing_service?: string | null;
  package_signing_fingerprint?: string | null;
  retain_package_versions?: number;
  checksum_type?: RPMChecksumType | null;
  compression_type?: RPMCompressionType | null;
  layout?: RPMLayoutType | null;
  repo_config?: Record<string, unknown>;
  osv_config?: { name: string; releases: unknown }[] | null;
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

export type { RPMRepositoryType };
