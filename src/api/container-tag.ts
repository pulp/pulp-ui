import { PulpAPI } from './pulp';

const base = new PulpAPI();
base.apiPath = 'repositories/container/container-push/';

export const ContainerTagAPI = {
  tag: (repositoryID: string, tag: string, digest: string) =>
    base.http.post(base.apiPath + `${repositoryID}/tag/`, {
      digest,
      tag,
    }),

  untag: (repositoryID: string, tag: string) =>
    base.http.post(base.apiPath + `${repositoryID}/untag/`, {
      tag,
    }),
};
