import { PulpAPI } from './pulp';

const base = new PulpAPI();

export class RPMDistributionType {
  pulp_href?: string;
  prn?: string;
  pulp_created?: string;
  pulp_last_updated?: string;
  base_path: string;
  base_url?: string;
  content_guard?: string;
  no_content_change_since?: string;
  hidden?: boolean;
  pulp_labels?: Record<string, string>;
  name: string;
  repository?: string;
  publication?: string;
  generate_repo_config?: boolean;
  checkpoint?: boolean;
}

// simplified version of smartUpdate from execution-environment-registry
function smartUpdate(remote: RPMDistributionType, unmodifiedRemote: RPMDistributionType) {
  for (const field of Object.keys(remote)) {
    if (remote[field] === '') {
      remote[field] = null;
    }

    // API returns headers:null bull doesn't accept it .. and we don't edit headers
    if (remote[field] === null && unmodifiedRemote[field] === null) {
      delete remote[field];
    }
  }

  return remote;
}


export const RPMDistributionAPI = {
  create: (data) => base.http.post(`distributions/rpm/rpm/`, data),

  delete: (id) => base.http.delete(`distributions/rpm/rpm/${id}/`),

  list: (params?) => base.list(`distributions/rpm/rpm/`, params),

  smartUpdate: (id, newValue: RPMDistributionType, oldValue: RPMDistributionType) =>
      base.http.put(`distributions/rpm/rpm/${id}/`, smartUpdate(newValue, oldValue)),
};
