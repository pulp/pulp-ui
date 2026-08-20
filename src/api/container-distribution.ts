import type { GenericDistribution } from './common';
import { PulpAPI } from './pulp';

/**
 * Container Distribution Type.
 *
 * @see https://github.com/pulp/pulp_container/blob/b109af03cb7aae3431f7a73204e6a73a8457694c/pulp_container/app/serializers.py#L424
 */
interface ContainerDistributionType extends Omit<
  GenericDistribution,
  'base_url'
> {
  readonly registry_path: string;
  content_guard?: string;
  readonly namespace?: string;
  description?: string | null;
  repository_version?: string | null;
  readonly remote?: string;
  private?: boolean;
  readonly pulp_domain?: string;
}

/**
 * Container Pull Through Type.
 *
 * @see https://github.com/pulp/pulp_container/blob/b109af03cb7aae3431f7a73204e6a73a8457694c/pulp_container/app/serializers.py#L520
 */
interface ContainerPullThroughDistributionType extends Omit<
  GenericDistribution,
  'base_url'
> {
  remote: string;
  readonly namespace?: string;
  content_guard?: string;
  distributions?: string[];
  description?: string | null;
  private?: boolean;
  readonly pulp_domain?: string;
}

const base = new PulpAPI();

export const ContainerDistributionAPI = {
  patch: (id, data) =>
    base.http.patch(`distributions/container/container/${id}/`, data),

  list: (params?) => base.list(`distributions/container/container/`, params),

  url: (distro_data) => distro_data.registry_path,
};

export const ContainerPullThroughDistributionAPI = {
  list: (params?) => base.list(`distributions/container/pull-through/`, params),

  // We should probably put this into a field on the serializer
  url: (distro_data) => `${window.location.host}/${distro_data.base_path}/`,
};

export type { ContainerDistributionType, ContainerPullThroughDistributionType };
