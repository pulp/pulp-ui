import type { GenericRemote } from './common';
import { PulpAPI } from './pulp';

/**
 * RPM Remote Type.
 *
 * @see https://github.com/pulp/pulp_rpm/blob/main/pulp_rpm/app/serializers/repository.py
 */
interface RPMRemoteType extends GenericRemote {
  sles_auth_token?: string | null;
}

// as in deb-remote / file-remote
function smartUpdate(remote: RPMRemoteType, unmodifiedRemote: RPMRemoteType) {
  for (const field of Object.keys(remote)) {
    if (remote[field] === '') {
      remote[field] = null;
    }

    // API returns headers:null but doesn't accept it .. and we don't edit headers
    if (remote[field] === null && unmodifiedRemote[field] === null) {
      delete remote[field];
    }
  }

  return remote;
}

const base = new PulpAPI();

export const RPMRemoteAPI = {
  create: (data) => base.http.post(`remotes/rpm/rpm/`, data),

  delete: (id) => base.http.delete(`remotes/rpm/rpm/${id}/`),

  get: (id) => base.http.get(`remotes/rpm/rpm/${id}/`),

  list: (params?) => base.list(`remotes/rpm/rpm/`, params),

  smartUpdate: (id, newValue: RPMRemoteType, oldValue: RPMRemoteType) =>
    base.http.put(`remotes/rpm/rpm/${id}/`, smartUpdate(newValue, oldValue)),
};

export type { RPMRemoteType };