import { PulpAPI } from './pulp';

export class FileRepositoryType {
  autopublish?: boolean;
  description: string | null;
  latest_version_href?: string;
  manifest?: string;
  name: string;
  prn?: string;
  pulp_created?: string;
  pulp_href?: string;
  pulp_labels: Record<string, string>;
  pulp_last_updated?: string;
  remote: string | null;
  retain_repo_versions: number;
  versions_href?: string;
}

const base = new PulpAPI();

export const FileRepositoryAPI = {
  create: (data) => base.http.post(`repositories/file/file/`, data),

  delete: (id) => base.http.delete(`repositories/file/file/${id}/`),

  list: (params?) => base.list(`repositories/file/file/`, params),

  listVersions: (id: string, params?) =>
    base.list(`repositories/file/file/${id}/versions/`, params),

  revert: (id: string, version_href) =>
    base.http.post(`repositories/file/file/${id}/modify/`, {
      base_version: version_href,
    }),

  sync: (id: string, body = {}) =>
    base.http.post(`repositories/file/file/${id}/sync/`, body),

  update: (id: string, data) =>
    base.http.put(`repositories/file/file/${id}/`, data),
};
