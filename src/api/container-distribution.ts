import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const ContainerDistributionAPI = {
  patch: (id, data) =>
    base.http.patch(`distributions/container/container/${id}/`, data),
};
