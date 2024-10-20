import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'tasks/purge/';

export const TaskPurgeAPI = {
  create: (data) => base.create(data),
};
