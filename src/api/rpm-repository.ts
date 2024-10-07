import { PulpAPI } from './pulp';

class API extends PulpAPI {
  apiPath = 'repositories/rpm/rpm/';

  // list(params?)
}

export const RPMRepositoryAPI = new API();
