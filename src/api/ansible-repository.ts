import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'repositories/ansible/ansible/';

export const AnsibleRepositoryAPI = {
  addContent: (id: string, collection_version_hrefs) =>
    base.http.post(base.apiPath + id + '/modify/', {
      add_content_units: collection_version_hrefs,
    }),

  addRole: (id: string, role) =>
    base.create(role, base.apiPath + id + '/add_role/'),

  copyCollectionVersion: (
    id: string,
    body: {
      collection_versions: string[];
      destination_repositories: string[];
      signing_service?: string;
    },
  ) => base.http.post(base.apiPath + id + '/copy_collection_version/', body),

  create: (data) => base.create(data),

  delete: (id: string) => base.delete(id),

  list: (params?) => base.list(params),

  listRoles: (id: string, params?) =>
    base.list(params, base.apiPath + id + '/list_roles/'),

  listVersions: (id: string, params?) =>
    base.list(params, base.apiPath + id + '/versions/'),

  moveCollectionVersion: (
    id: string,
    body: {
      collection_versions: string[];
      destination_repositories: string[];
      signing_service?: string;
    },
  ) => base.http.post(base.apiPath + id + '/move_collection_version/', body),

  myPermissions: (id: string, params?) =>
    base.list(params, base.apiPath + id + '/my_permissions/'),

  removeContent: (id: string, collection_version_href) =>
    base.http.post(base.apiPath + id + '/modify/', {
      remove_content_units: [collection_version_href],
    }),

  removeRole: (id: string, role) =>
    base.create(role, base.apiPath + id + '/remove_role/'),

  revert: (id: string, version_href) =>
    base.http.post(base.apiPath + id + '/modify/', {
      base_version: version_href,
    }),

  sync: (id: string, body = {}) =>
    base.http.post(base.apiPath + id + '/sync/', body),

  update: (id: string, data) => base.update(id, data),
};
