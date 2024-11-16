import { PulpAPI } from './pulp';

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
