import { PulpAPI } from './pulp';

const base = new PulpAPI();

// FIXME HubAPI
export const ExecutionEnvironmentAPI = {
  deleteExecutionEnvironment: (name) =>
    base.http.delete(`v3/plugin/execution-environments/repositories/${name}/`),

  deleteImage: (name, manifest) =>
    base.http.delete(
      `v3/plugin/execution-environments/repositories/${name}/_content/images/${manifest}/`,
    ),

  get: (id) =>
    base.http.get(`v3/plugin/execution-environments/repositories/${id}/`),

  image: (name, digest) =>
    base.http.get(
      `v3/plugin/execution-environments/repositories/${name}/_content/images/${digest}/`,
    ),

  images: (name, params) =>
    base.list(
      `v3/plugin/execution-environments/repositories/${name}/_content/images/`,
      params,
    ),

  list: (params?) =>
    base.list(`v3/plugin/execution-environments/repositories/`, params),

  readme: (name) =>
    base.http.get(
      `v3/plugin/execution-environments/repositories/${name}/_content/readme/`,
    ),

  saveReadme: (name, readme) =>
    base.http.put(
      `v3/plugin/execution-environments/repositories/${name}/_content/readme/`,
      readme,
    ),

  tags: (name, params) =>
    base.list(
      `v3/plugin/execution-environments/repositories/${name}/_content/tags/`,
      params,
    ),
};
