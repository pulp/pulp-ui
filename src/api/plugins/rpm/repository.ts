import type { AxiosResponse } from 'axios';
import type {
  GenericPaginatedResponse,
  GenericRepository,
  GenericRepositoryFilterParams,
} from '../../common';
import type { PulpAPI } from '../../pulp';

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
 * @see https://github.com/pulp/pulp_rpm/blob/dc333a99db6c44d70d6103540cb592f6e55a8682/pulp_rpm/app/serializers/repository.py#L177
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

interface RPMRepositoryClient {
  list: (
    params?: GenericRepositoryFilterParams,
    // FIXME: Move AxiosResponse type to PulpAPI Base Class.
  ) => Promise<AxiosResponse<GenericPaginatedResponse<RPMRepositoryType[]>>>;
  // retrieve: () => Promise<unknown>;
  // create: () => Promise<unknown>;
  // update: () => Promise<unknown>;
}

/**
 * RPM Repository API Client
 * @param {PulpAPI} base
 * @returns {RPMRepositoryClient}
 *
 * @see https://github.com/pulp/pulp_rpm/blob/dc333a99db6c44d70d6103540cb592f6e55a8682/pulp_rpm/app/viewsets/repository.py#L76
 */
function createRepositoryAPI(base: PulpAPI): RPMRepositoryClient {
  return {
    list: (params?: GenericRepositoryFilterParams) =>
      base.list(`repositories/rpm/rpm/`, params),
    // retrieve: () => {},
    // create: () => {},
    // update: () => {},
  };
}

export { createRepositoryAPI };
export type { RPMRepositoryType };
