import { PulpAPI } from './pulp';

const base = new PulpAPI();

// FIXME HubAPI
export const TaskAPI = {
  get: (id) => base.http.get(`v3/tasks/${id}/`),
};
