import { PulpAPI } from './pulp';

class API extends PulpAPI {
  apiPath = 'distributions/container/container/';

  // patch(id, data)
}

export const ContainerDistributionAPI = new API();
