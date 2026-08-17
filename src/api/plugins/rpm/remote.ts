import type { AxiosResponse } from 'axios';
import type {
  DispatchedTaskResponse,
  GenericRemote,
  GenericRemoteFilterParams,
  PaginatedResponse,
} from 'src/api/common';
import type { PulpAPI } from 'src/api/pulp';

/**
 * RPM Remote Type.
 *
 * @see https://github.com/pulp/pulp_rpm/blob/dc333a99db6c44d70d6103540cb592f6e55a8682/pulp_rpm/app/serializers/repository.py#L392
 */
interface RPMRemoteType extends GenericRemote {
  sles_auth_token?: string | null;
}

// FIXME: Move AxiosResponse type to PulpAPI Base Class.
// NOTE: The FIXME implementation is not easy as to avoid major type issues with legacy API calls.
interface RPMRemoteClient {
  list: (
    params?: GenericRemoteFilterParams,
  ) => Promise<AxiosResponse<PaginatedResponse<RPMRemoteType>>>;
  retrieve: (id: string) => Promise<AxiosResponse<RPMRemoteType>>;
  create: (data: RPMRemoteType) => Promise<AxiosResponse<RPMRemoteType>>;
  update: (
    id: string,
    data: Partial<RPMRemoteType>,
  ) => Promise<AxiosResponse<RPMRemoteType | DispatchedTaskResponse>>;
  delete: (id: string) => Promise<AxiosResponse<DispatchedTaskResponse>>;
}

/**
 * RPM Remote API Client
 * @param {PulpAPI} base
 * @returns {RPMRemoteClient}
 * 
 * @see https://github.com/pulp/pulp_rpm/blob/dc333a99db6c44d70d6103540cb592f6e55a8682/pulp_rpm/app/viewsets/repository.py#L361
 */
function createRemoteAPI(base: PulpAPI): RPMRemoteClient {
  return {
    list: (params?) => base.list(`remotes/rpm/rpm/`, params),
    retrieve: (id) => base.http.get(`remotes/rpm/rpm/${id}/`),
    create: (data) => base.http.post(`remotes/rpm/rpm/`, data),
    update: (id, data) => base.http.patch(`remotes/rpm/rpm/${id}/`, data),
    delete: (id) => base.http.delete(`remotes/rpm/rpm/${id}/`),
  };
}

export { createRemoteAPI };
export type { RPMRemoteType };
