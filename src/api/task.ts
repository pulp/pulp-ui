import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const TaskAPI = {
  get: (id) => base.http.get(`v3/tasks/${id}/`),
};
