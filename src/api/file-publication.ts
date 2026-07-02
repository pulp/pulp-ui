import type { GenericPublication } from './common';
import { PulpAPI } from './pulp';

/**
 * File Publication Type.
 *
 * @see https://github.com/pulp/pulpcore/blob/934c752dae916857b2005e1fe0ef75496accc082/pulp_file/app/serializers.py#L200
 */
interface FilePublicationType extends GenericPublication {
  readonly distributions: string[];
  manifest?: string | null;
  checkpoint?: boolean;
}

const base = new PulpAPI();

export const FilePublicationAPI = {
  create: (data) => base.http.post(`publications/file/file/`, data),

  delete: (id) => base.http.delete(`publications/file/file/${id}/`),

  list: (params?) => base.list(`publications/file/file/`, params),
};

export type { FilePublicationType };
