import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const RepairAPI = {
  create: (data) => base.http.post(`repair/`, data),
};
