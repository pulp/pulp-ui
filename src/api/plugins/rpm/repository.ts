import type { AxiosResponse } from 'axios';
import type {
  DispatchedTaskResponse,
  GenericRepository,
  GenericRepositoryFilterParams,
  PaginatedResponse,
} from '../../common';
import type { PulpAPI } from '../../pulp';
import type {
  RPMAllowedUpsertChecksumsType,
  RPMChecksumType,
  RPMCompressionType,
  RPMLayoutType,
} from './types';

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

/**
 * RPM Create / Update Type.
 *
 * @see https://github.com/pulp/pulp_rpm/blob/dc333a99db6c44d70d6103540cb592f6e55a8682/pulp_rpm/app/serializers/repository.py#L326
 */
interface RPMRepositoryUpsertType extends Omit<
  RPMRepositoryType,
  'checksum_type'
> {
  checksum_type?: RPMAllowedUpsertChecksumsType | null;
}

// FIXME: Move AxiosResponse type to PulpAPI Base Class.
// NOTE: The FIXME implementation is not easy as to avoid major type issues with legacy API calls.
interface RPMRepositoryClient {
  list: (
    params?: GenericRepositoryFilterParams,
  ) => Promise<AxiosResponse<PaginatedResponse<RPMRepositoryType>>>;
  retrieve: (id: string) => Promise<AxiosResponse<RPMRepositoryType>>;
  create: (
    data: RPMRepositoryUpsertType,
  ) => Promise<AxiosResponse<RPMRepositoryUpsertType>>;
  update: (
    id: string,
    data: Partial<RPMRepositoryUpsertType>,
  ) => Promise<AxiosResponse<RPMRepositoryUpsertType | DispatchedTaskResponse>>;
  delete: (id: string) => Promise<AxiosResponse<DispatchedTaskResponse>>;
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
    list: (params?) => base.list(`repositories/rpm/rpm/`, params),
    retrieve: (id) => base.http.get(`repositories/rpm/rpm/${id}/`),
    create: (data) => base.http.post(`repositories/rpm/rpm/`, data),
    update: (id, data) => base.http.patch(`repositories/rpm/rpm/${id}/`, data),
    delete: (id) => base.http.delete(`repositories/rpm/rpm/${id}/`),
  };
}

export { createRepositoryAPI };
export type { RPMRepositoryType, RPMRepositoryUpsertType };
