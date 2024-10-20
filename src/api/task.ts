import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'v3/tasks/';

export const TaskAPI = {
  get: (id) => base.get(id),
};
