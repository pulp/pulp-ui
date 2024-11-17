import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const FilePublicationAPI = {
  create: (data) => base.http.post(`publications/file/file/`, data),

  delete: (id) => base.http.delete(`publications/file/file/${id}/`),

  list: (params?) => base.list(`publications/file/file/`, params),
};
