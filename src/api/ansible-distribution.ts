import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const AnsibleDistributionAPI = {
  create: (data) => base.http.post(`distributions/ansible/ansible/`, data),

  delete: (id) => base.http.delete(`distributions/ansible/ansible/${id}/`),

  list: (params?) => base.list(`distributions/ansible/ansible/`, params),

  url: (distro_data) => distro_data.client_url,
};
