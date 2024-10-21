import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const ExecutionEnvironmentRemoteAPI = {
  create: (data) =>
    base.http.post(`_ui/v1/execution-environments/remotes/`, data),

  get: (id) => base.http.get(`_ui/v1/execution-environments/remotes/${id}/`),

  list: (params?) =>
    base.list(`_ui/v1/execution-environments/remotes/`, params),

  sync: (name) =>
    base.http.post(
      `v3/plugin/execution-environments/repositories/${name}/_content/sync/`,
      {},
    ),

  update: (id, data) =>
    base.http.put(`_ui/v1/execution-environments/remotes/${id}/`, data),
};
