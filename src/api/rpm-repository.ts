import { PulpAPI } from './pulp';

const base = new PulpAPI();

/**
 * @deprecated Use `RpmClient` from `src/api/plugins/rpm/client.ts` instead.
 */
export const RPMRepositoryAPI = {
  list: (params?) => base.list(`repositories/rpm/rpm/`, params),
};
