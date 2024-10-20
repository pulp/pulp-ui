import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = '_ui/v1/execution-environments/remotes/';

export const ExecutionEnvironmentRemoteAPI = {
  create: (data) => base.create(data),

  get: (id) => base.get(id),

  list: (params?) => base.list(params),

  sync: (name) =>
    base.http.post(
      `v3/plugin/execution-environments/repositories/${name}/_content/sync/`,
      {},
    ),

  update: (id, data) => base.update(id, data),
};
