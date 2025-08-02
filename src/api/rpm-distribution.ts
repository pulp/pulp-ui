import { PulpAPI } from './pulp';

const base = new PulpAPI();


// rpm.RpmDistributionResponse:
//   type: object
//   description: Serializer for RPM Distributions.
//   properties:
//     pulp_href:
//       type: string
//       format: uri
//       readOnly: true
//     prn:
//       type: string
//       readOnly: true
//       description: The Pulp Resource Name (PRN).
//     pulp_created:
//       type: string
//       format: date-time
//       readOnly: true
//       description: Timestamp of creation.
//     pulp_last_updated:
//       type: string
//       format: date-time
//       readOnly: true
//       description: 'Timestamp of the last time this resource was updated. Note:
//         for immutable resources - like content, repository versions, and publication
//         - pulp_created and pulp_last_updated dates will be the same.'
//     base_path:
//       type: string
//       description: The base (relative) path component of the published url. Avoid
//         paths that                     overlap with other distribution base paths
//         (e.g. "foo" and "foo/bar")
//     base_url:
//       type: string
//       readOnly: true
//       description: The URL for accessing the publication as defined by this distribution.
//     content_guard:
//       type: string
//       format: uri
//       nullable: true
//       description: An optional content-guard.
//     no_content_change_since:
//       type: string
//       readOnly: true
//       description: Timestamp since when the distributed content served by this
//         distribution has not changed. If equals to `null`, no guarantee is provided
//         about content changes.
//     hidden:
//       type: boolean
//       default: false
//       description: Whether this distribution should be shown in the content app.
//     pulp_labels:
//       type: object
//       additionalProperties:
//         type: string
//         nullable: true
//     name:
//       type: string
//       description: A unique name. Ex, `rawhide` and `stable`.
//     repository:
//       type: string
//       format: uri
//       nullable: true
//       description: The latest RepositoryVersion for this Repository will be served.
//     publication:
//       type: string
//       format: uri
//       nullable: true
//       description: Publication to be served
//     generate_repo_config:
//       type: boolean
//       default: false
//       description: An option specifying whether Pulp should generate *.repo files.
//     checkpoint:
//       type: boolean
//   required:
//     - base_path
//     - name

export class RPMDistributionType {
  pulp_href?: string;
  prn?: string;
  pulp_created?: string;
  pulp_last_updated?: string;
  base_path: string;
  base_url?: string;
  content_guard?: string;
  no_content_change_since?: string;
  hidden?: boolean;
  pulp_labels?: Record<string, string>;
  name: string;
  repository?: string;
  publication?: string;
  generate_repo_config?: boolean;
  checkpoint?: boolean;
}

// simplified version of smartUpdate from execution-environment-registry
function smartUpdate(remote: RPMDistributionType, unmodifiedRemote: RPMDistributionType) {
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


export const RPMDistributionAPI = {
  create: (data) => base.http.post(`distributions/rpm/rpm/`, data),

  delete: (id) => base.http.delete(`distributions/rpm/rpm/${id}/`),

  list: (params?) => base.list(`distributions/rpm/rpm/`, params),

  smartUpdate: (id, newValue: RPMDistributionType, oldValue: RPMDistributionType) =>
      base.http.put(`distributions/rpm/rpm/${id}/`, smartUpdate(newValue, oldValue)),
};
