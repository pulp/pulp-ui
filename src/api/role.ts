import { config } from 'src/ui-config';
import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'roles/';

export const RoleAPI = {
  addPermission: (id, data) =>
    base.http.post(base.apiPath + id + '/model-permissions/', data),

  create: (data) => base.create(data),

  delete: (id) => base.delete(id),

  get: (params?) => base.get(params),

  getPermissions: (id) =>
    base.http.get(
      base.apiPath + id + '/model-permissions/?limit=100000&offset=0',
    ),

  list: (params?, for_object_type?) => {
    const newParams = { ...params };
    if (for_object_type) {
      // ?for_object_type=/pulp/api/v3/.../
      // list visible in http://localhost:8002/pulp/api/v3/
      newParams.for_object_type = config.API_BASE_PATH + for_object_type + '/';
    }
    return base.list(newParams);
  },

  removePermission: (id, permissionId) =>
    base.http.delete(
      base.apiPath + id + '/model-permissions/' + permissionId + '/',
    ),

  updatePermissions: (id, data) => base.http.patch(base.apiPath + id, data),
};
