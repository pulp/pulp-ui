import { PulpAPI } from './pulp';

const base = new PulpAPI();

// FIXME pulp
export const ActivitiesAPI = {
  listRepo: (id, params?) =>
    base.list(
      params,
      `v3/plugin/execution-environments/repositories/${id}/_content/history/`,
    ),
};
