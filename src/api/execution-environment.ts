import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'v3/plugin/execution-environments/repositories/';

export const ExecutionEnvironmentAPI = {
  deleteExecutionEnvironment: (name) =>
    base.http.delete(base.apiPath + `${name}/`),

  deleteImage: (name, manifest) =>
    base.http.delete(base.apiPath + `${name}/_content/images/${manifest}/`),

  get: (id) => base.get(id),

  image: (name, digest) =>
    base.http.get(base.apiPath + `${name}/_content/images/${digest}/`),

  images: (name, params) =>
    base.http.get(
      base.apiPath + `${name}/_content/images/`,
      base.mapParams(params),
    ),

  list: (params?) => base.list(params),

  readme: (name) => base.http.get(base.apiPath + `${name}/_content/readme/`),

  saveReadme: (name, readme) =>
    base.http.put(base.apiPath + `${name}/_content/readme/`, readme),

  tags: (name, params) =>
    base.http.get(
      base.apiPath + `${name}/_content/tags/`,
      base.mapParams(params),
    ),
};
