import { PulpAPI } from './pulp';

const base = new PulpAPI();

// FIXME HubAPI
export const ActivitiesAPI = {
  listRepo: (id, params?) =>
    base.list(
      `v3/plugin/execution-environments/repositories/${id}/_content/history/`,
      params,
    ),
};
