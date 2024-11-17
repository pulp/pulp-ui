import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const FileContentAPI = {
  create: (data) => base.http.post(`content/file/files/`, data),

  get: (href) => base.http.get(href),

  list: (params?) => base.list(`content/file/files/`, params),
};
