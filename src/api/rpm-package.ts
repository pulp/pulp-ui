import { PulpAPI } from './pulp';

class API extends PulpAPI {
  apiPath = 'content/rpm/packages/';

  // list(params?)
}

export const RPMPackageAPI = new API();
