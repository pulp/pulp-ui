import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'distributions/ansible/ansible/';

export const AnsibleDistributionAPI = {
  create: (data) => base.create(data),

  delete: (id) => base.delete(id),

  list: (params?) => base.list(params),
};
