import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'tasks/';

export const TaskManagementAPI = {
  get: (id) => base.get(id),

  list: (params?) => base.list(params),

  patch: (id, data) => base.patch(id, data),
};
