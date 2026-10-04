import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const PythonPackageAPI = {
  list: (params?) => base.list(`content/python/packages/`, params),
};
