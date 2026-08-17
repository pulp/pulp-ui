import type { GenericDistribution } from 'src/api/common';
import type { PulpAPI } from 'src/api/pulp';

/**
 * RPM Distribution Type.
 * 
 * @see https://github.com/pulp/pulp_rpm/blob/dc333a99db6c44d70d6103540cb592f6e55a8682/pulp_rpm/app/serializers/repository.py#L575
 */
interface RPMDistributionType extends GenericDistribution {
  publication?: string | null;
  generate_repo_config?: boolean;
  checkpoint?: boolean;
}

// FIXME: Move AxiosResponse type to PulpAPI Base Class.
// NOTE: The FIXME implementation is not easy as to avoid major type issues with legacy API calls.
interface RPMDistributionClient {
  list: () => void;
  retrieve: () => void;
  create: () => void;
  update: () => void;
  delete: () => void;
}

/**
 * RPM Distribution API Client
 * @param {PulpAPI} base
 * @returns
 * 
 * @see https://github.com/pulp/pulp_rpm/blob/dc333a99db6c44d70d6103540cb592f6e55a8682/pulp_rpm/app/viewsets/repository.py#L636
 */
function createDistributionAPI(base: PulpAPI): RPMDistributionClient {
  return {
    list: () => undefined,
    retrieve: () => undefined,
    create: () => undefined,
    update: () => undefined,
    delete: () => undefined,
  };
}

export { createDistributionAPI };
export type { RPMDistributionType };
