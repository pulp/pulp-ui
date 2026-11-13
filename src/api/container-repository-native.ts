import { PulpAPI } from './pulp';
import { config } from 'src/ui-config';

const base = new PulpAPI();

const toRelativeHref = (href: string) =>
  href?.replace(config.API_BASE_PATH, '') || href;

export interface ContainerRepositoryNativeType {
  pulp_href: string;
  name: string;
  description: string | null;
  remote: string | null;
  pulp_created: string;
  pulp_last_updated: string;
  latest_version_href?: string;
  retain_repo_versions?: number;
  pulp_labels?: Record<string, string>;
}

export interface ContainerRepositoryVersionType {
  pulp_href: string;
  pulp_created: string;
  number: number;
  repository: string;
  base_version: string | null;
  content_summary: {
    added: Record<string, { count: number; href: string }>;
    removed: Record<string, { count: number; href: string }>;
    present: Record<string, { count: number; href: string }>;
  };
}

export const ContainerRepositoryNativeAPI = {
  get: (id: string) => base.http.get(`repositories/container/container/${id}/`),

  getByHref: (href: string) => base.http.get(toRelativeHref(href)),

  list: (params?) => base.list('repositories/container/container/', params),

  listVersions: (id: string, params?) =>
    base.list(`repositories/container/container/${id}/versions/`, params),

  listVersionsByHref: (href: string, params?) =>
    base.list(`${toRelativeHref(href)}versions/`, params),
};
