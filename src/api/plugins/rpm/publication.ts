import type { AxiosResponse } from 'axios';
import type {
  GenericPublication,
  GenericPublicationFilterParams,
  PaginatedResponse,
} from 'src/api/common';
import type { PulpAPI } from 'src/api/pulp';
import type {
  RPMChecksumType,
  RPMCompressionType,
  RPMLayoutType,
} from './types';

/**
 * RPM Publication Type.
 *
 * @see https://github.com/pulp/pulp_rpm/blob/dc333a99db6c44d70d6103540cb592f6e55a8682/pulp_rpm/app/serializers/repository.py#L474
 */
interface RPMPublicationType extends GenericPublication {
  checkpoint?: boolean;
  checksum_type?: RPMChecksumType;
  compression_type?: RPMCompressionType;
  layout?: RPMLayoutType | null;
  repo_config?: Record<string, unknown>;
}

// FIXME: Move AxiosResponse type to PulpAPI Base Class.
// NOTE: The FIXME implementation is not easy as to avoid major type issues with legacy API calls.
interface RPMPublicationClient {
  list: (
    params?: GenericPublicationFilterParams,
  ) => Promise<AxiosResponse<PaginatedResponse<RPMPublicationType>>>;
  retrieve: (id: string) => Promise<AxiosResponse<RPMPublicationType>>;
  create: () => void;
  delete: () => void;
}

/**
 * RPM Publication API Client.
 * @param {PulpAPI} base
 * @returns {RPMPublicationClient}
 *
 * @see https://github.com/pulp/pulp_rpm/blob/dc333a99db6c44d70d6103540cb592f6e55a8682/pulp_rpm/app/viewsets/repository.py#L519
 */
function createPublicationAPI(base: PulpAPI): RPMPublicationClient {
  return {
    list: (params?) => base.list(`publications/rpm/rpm/`, params),
    retrieve: (id) => base.http.get(`publications/rpm/rpm/${id}/`),
    create: () => undefined,
    delete: () => undefined,
  };
}

export { createPublicationAPI };
export type { RPMPublicationType };
