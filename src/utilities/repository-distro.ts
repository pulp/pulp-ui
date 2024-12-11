import { t } from '@lingui/core/macro';
import { GenericDistributionAPI, GenericRepositoryAPI } from 'src/api';
import { ModelToApi } from 'src/utilities/model-to-api';
import { parsePulpResource } from 'src/utilities/parse-pulp-id';

// returns the preferred distribution given a repo name
// if there is a distribution with the same name as the repository, it will be used (as long as it's connected to the right repo too)
// if not, the oldest will be used
// reject if no distributions or repository
// optional pulp_href param skips repo lookup
// optional distributionAPI to avoid one API call

interface Distribution {
  pulp_href: string;
  prn: string;
  name: string;
  base_path: string;
  base_url?: string;
  repository?: string;
  publication?: string;
  repository_version?: string;
  remote?: string;
}

export function repositoryDistro(
  name,
  pulp_href?,
  distributionAPI?,
): Promise<Distribution> {
  return Promise.all([
    pulp_href
      ? Promise.resolve({ name, pulp_href })
      : GenericRepositoryAPI.list({ name, page_size: 1 }).then(firstResult),
    distributionAPI
      ? distributionAPI.list({ name, page_size: 1 }).then(firstResult)
      : GenericDistributionAPI.list({ name, page_size: 1 }).then(firstResult),
  ]).then(async ([repository, distribution]) => {
    if (!repository) {
      return Promise.reject(t`Failed to find repository ${name}`);
    }
    const params = {
      repository: repository.pulp_href,
      sort: 'pulp_created',
      page_size: 1,
    };
    if (distribution && distribution.repository === repository.pulp_href) {
      if (distributionAPI) {
        return distribution;
      }
      params['name'] = distribution.name;
    }

    const resource = parsePulpResource(repository.pulp_href);
    const api = ModelToApi[resource.model];
    distribution = await api.list(params).then(firstResult);
    if (!distribution) {
      return Promise.reject(
        t`Failed to find a distribution for repository ${name}`,
      );
    }

    return distribution;
  });
}

export function repositoryBasePath(name, pulp_href?): Promise<string> {
  return repositoryDistro(name, pulp_href).then(({ base_path }) => base_path);
}

function firstResult({ data: { results } }) {
  return results[0];
}
