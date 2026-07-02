import type { GenericRemote } from './common';
import { PulpAPI } from './pulp';

/**
 * File Remote Type.
 *
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulp_file/app/serializers.py#L165
 */
interface FileRemoteType extends GenericRemote {
  /**
   * NOTE: Not part of the File serializer, populated separately.
   * This should be broken out into its own type and extend the interface.
   */
  my_permissions?: string[];
}

// simplified version of smartUpdate from execution-environment-registry
function smartUpdate(remote: FileRemoteType, unmodifiedRemote: FileRemoteType) {
  for (const field of Object.keys(remote)) {
    if (remote[field] === '') {
      remote[field] = null;
    }

    // API returns headers:null bull doesn't accept it .. and we don't edit headers
    if (remote[field] === null && unmodifiedRemote[field] === null) {
      delete remote[field];
    }
  }

  return remote;
}

const base = new PulpAPI();

export const FileRemoteAPI = {
  create: (data) => base.http.post(`remotes/file/file/`, data),

  delete: (id) => base.http.delete(`remotes/file/file/${id}/`),

  get: (id) => base.http.get(`remotes/file/file/${id}/`),

  list: (params?) => base.list(`remotes/file/file/`, params),

  smartUpdate: (id, newValue: FileRemoteType, oldValue: FileRemoteType) =>
    base.http.put(`remotes/file/file/${id}/`, smartUpdate(newValue, oldValue)),
};

export type { FileRemoteType };
