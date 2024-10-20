import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'repositories/rpm/rpm/';

export const RPMRepositoryAPI = {
  list: (params?) => base.list(params),
};
