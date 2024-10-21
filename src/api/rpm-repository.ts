import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const RPMRepositoryAPI = {
  list: (params?) => base.list(`repositories/rpm/rpm/`, params),
};
