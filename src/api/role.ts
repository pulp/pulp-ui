import { config } from 'src/ui-config';
import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const RoleAPI = {
  addPermission: (id, data) =>
    base.http.post(`roles/${id}/model-permissions/`, data),

  create: (data) => base.http.post(`roles/`, data),

  delete: (id) => base.http.delete(`roles/${id}/`),

  get: (id) => base.http.get(`roles/${id}/`),

  getPermissions: (id) =>
    base.http.get(`roles/${id}/model-permissions/?limit=100000&offset=0`),

  list: (params?, for_object_type?) => {
    const newParams = { ...params };
    if (for_object_type) {
      // ?for_object_type=/pulp/api/v3/.../
      // list visible in http://localhost:8002/pulp/api/v3/
      newParams.for_object_type = `${config.API_BASE_PATH}${for_object_type}/`;
    }
    return base.list(`roles/`, newParams);
  },

  removePermission: (id, permissionId) =>
    base.http.delete(`roles/${id}/model-permissions/${permissionId}/`),

  updatePermissions: (id, data) => base.http.patch(`roles/${id}/`, data),
};
