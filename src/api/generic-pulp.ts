import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const GenericPulpAPI = {
  get: (url: string) => base.http.get(url),

  list: (url: string, params = {}) => base.list(url, params),
};

export const GenericContentAPI = {
  list: (params?) => base.list(`content/`, params),
};

export const GenericDistributionAPI = {
  list: (params?) => base.list(`distributions/`, params),
};

export const GenericPublicationAPI = {
  list: (params?) => base.list(`publications/`, params),
};

export const GenericRemoteAPI = {
  list: (params?) => base.list(`remotes/`, params),
};

export const GenericRepositoryAPI = {
  list: (params?) => base.list(`repositories/`, params),
};

export const GenericRepositoryVersionAPI = {
  list: (params?) => base.list(`repository_versions/`, params),
};
