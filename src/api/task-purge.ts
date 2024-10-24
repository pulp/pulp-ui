import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const TaskPurgeAPI = {
  create: (data) => base.http.post(`tasks/purge/`, data),
};
