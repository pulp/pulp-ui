import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'repair/';

export const RepairAPI = {
  create: (data) => base.create(data),
};
