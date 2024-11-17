import { type RemoteType } from '.';
import { PulpAPI } from './pulp';

// Deletes any hidden fields from the object so that they don't get sent to the API
function clearSetFieldsFromRequest(data, hidden_fields) {
  const newObj = { ...data };

  for (const field of hidden_fields) {
    if (field.is_set) {
      delete newObj[field.name];
    }
  }

  return newObj;
}

// removes unchanged values and hidden fields before updating
function smartUpdate(remote: RemoteType, unmodifiedRemote: RemoteType) {
  // Deletes any hidden fields from the object that are market as is_set.
  // This is to prevent accidentally clearing fields that weren't updated.

  // TODO: clearing set fields from the response will be unnecesary if the API
  // stops returning field: null on hidden fields
  const reducedData: RemoteType = clearSetFieldsFromRequest(
    remote,
    remote.hidden_fields,
  ) as RemoteType;

  // Pulp complains if auth_url gets sent with a request that doesn't include a
  // valid token, even if the token exists in the database and isn't being changed.
  // To solve this issue, simply delete auth_url from the request if it hasn't
  // been updated by the user.
  if (reducedData.auth_url === unmodifiedRemote.auth_url) {
    delete reducedData['auth_url'];
  }

  for (const field of Object.keys(reducedData)) {
    if (reducedData[field] === '') {
      reducedData[field] = null;
    }
  }

  return reducedData;
}

const base = new PulpAPI();

// FIXME HubAPI
export const ExecutionEnvironmentRegistryAPI = {
  create: (data) =>
    base.http.post(`_ui/v1/execution-environments/registries/`, data),

  delete: (id) =>
    base.http.delete(`_ui/v1/execution-environments/registries/${id}/`),

  get: (id) => base.http.get(`_ui/v1/execution-environments/registries/${id}/`),

  index: (id) =>
    base.http.post(`_ui/v1/execution-environments/registries/${id}/index/`, {}),

  list: (params?) =>
    base.list(`_ui/v1/execution-environments/registries/`, params),

  smartUpdate: (id, newValue: RemoteType, oldValue: RemoteType) =>
    base.http.put(
      `_ui/v1/execution-environments/registries/${id}/`,
      smartUpdate(newValue, oldValue),
    ),

  sync: (id) =>
    base.http.post(`_ui/v1/execution-environments/registries/${id}/sync/`, {}),
};
