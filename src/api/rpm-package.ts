import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const RPMPackageAPI = {
  list: (params?) => base.list(`content/rpm/packages/`, params),
};
