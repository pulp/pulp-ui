import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'distributions/container/container/';

export const ContainerDistributionAPI = {
  patch: (id, data) => base.patch(id, data),
};
