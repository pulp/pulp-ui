import { PulpAPI } from './pulp';

const base = new PulpAPI();

export const ContainerTagAPI = {
  tag: (repositoryID: string, tag: string, digest: string) =>
    base.http.post(
      `repositories/container/container-push/${repositoryID}/tag/`,
      {
        digest,
        tag,
      },
    ),

  untag: (repositoryID: string, tag: string) =>
    base.http.post(
      `repositories/container/container-push/${repositoryID}/untag/`,
      {
        tag,
      },
    ),
};
