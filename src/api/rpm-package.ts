import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'content/rpm/packages/';

export const RPMPackageAPI = {
  list: (params?) => base.list(params),
};
