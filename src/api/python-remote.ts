import type { GenericRemote } from './common';
import { PulpAPI } from './pulp';

type PythonPackageType =
  | 'bdist_dmg'
  | 'bdist_dumb'
  | 'bdist_egg'
  | 'bdist_msi'
  | 'bdist_rpm'
  | 'bdist_wheel'
  | 'bdist_wininst'
  | 'sdist';
type PythonPlatform = 'windows' | 'macos' | 'freebsd' | 'linux';

/**
 * Python Remote Type.
 *
 * @see https://github.com/pulp/pulp_python/blob/main/pulp_python/app/serializers.py
 */
interface PythonRemoteType extends GenericRemote {
  includes?: string[];
  excludes?: string[];
  prereleases?: boolean;
  package_types?: PythonPackageType[];
  keep_latest_packages?: number;
  exclude_platforms?: PythonPlatform[];
  provenance?: boolean;
}

// as in deb-remote / file-remote
function smartUpdate(
  remote: PythonRemoteType,
  unmodifiedRemote: PythonRemoteType,
) {
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

export const PythonRemoteAPI = {
  create: (data) => base.http.post(`remotes/python/python/`, data),

  delete: (id) => base.http.delete(`remotes/python/python/${id}/`),

  get: (id) => base.http.get(`remotes/python/python/${id}/`),

  list: (params?) => base.list(`remotes/python/python/`, params),

  smartUpdate: (id, newValue: PythonRemoteType, oldValue: PythonRemoteType) =>
    base.http.put(
      `remotes/python/python/${id}/`,
      smartUpdate(newValue, oldValue),
    ),
};

export type { PythonPackageType, PythonPlatform, PythonRemoteType };
