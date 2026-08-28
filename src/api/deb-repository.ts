import { PulpAPI } from './pulp';

export class DebRepositoryType {
  autopublish?: boolean;
  description: string | null;
  latest_version_href?: string;
  name: string;
  prn?: string;
  publish_upstream_release_fields?: boolean;
  pulp_created?: string;
  pulp_href?: string;
  pulp_labels: Record<string, string>;
  pulp_last_updated?: string;
  remote: string | null;
  retain_repo_versions: number;
  signing_service?: string | null;
  versions_href?: string;
}

const base = new PulpAPI();

export const DebRepositoryAPI = {
  create: (data) => base.http.post(`repositories/deb/apt/`, data),

  delete: (id) => base.http.delete(`repositories/deb/apt/${id}/`),

  list: (params?) => base.list(`repositories/deb/apt/`, params),

  listVersions: (id: string, params?) =>
    base.list(`repositories/deb/apt/${id}/versions/`, params),

  revert: (id: string, version_href) =>
    base.http.post(`repositories/deb/apt/${id}/modify/`, {
      base_version: version_href,
    }),

  sync: (id: string, body = {}) =>
    base.http.post(`repositories/deb/apt/${id}/sync/`, body),

  update: (id: string, data) =>
    base.http.put(`repositories/deb/apt/${id}/`, data),
};
