import { t } from '@lingui/core/macro';
import {
  AnsibleDistributionAPI,
  AnsibleRepositoryAPI,
  FileDistributionAPI,
  FileRepositoryAPI,
  RPMDistributionAPI,
  RPMRepositoryAPI,
} from 'src/api';

// returns the preferred distribution base_path given a repo name
// if there is a distribution with the same name as the repository, it will be used (as long as it's connected to the right repo too)
// if not, the oldest will be used
// reject if no distributions or repository
// optional pulp_href param skips repo lookup

export function plugin2api(plugin) {
  switch (plugin) {
    case 'ansible':
      return {
        DistributionAPI: AnsibleDistributionAPI,
        RepositoryAPI: AnsibleRepositoryAPI,
      };
    case 'file':
      return {
        DistributionAPI: FileDistributionAPI,
        RepositoryAPI: FileRepositoryAPI,
      };
    case 'rpm':
      return {
        // FIXME: DistributionAPI: RPMDistributionAPI,
        RepositoryAPI: RPMRepositoryAPI,
        DistributionAPI: RPMDistributionAPI
      };
    default:
      return {};
  }
}

export function pluginRepositoryBasePath(
  plugin,
  name,
  pulp_href?,
): Promise<string> {
  const { RepositoryAPI, DistributionAPI } = plugin2api(plugin);

  return Promise.all([
    pulp_href
      ? Promise.resolve({ name, pulp_href })
      : RepositoryAPI.list({ name, page_size: 1 }).then(firstResult),
    DistributionAPI.list({ name, page_size: 1 }).then(firstResult),
  ]).then(async ([repository, distribution]) => {
    if (!repository) {
      return Promise.reject(t`Failed to find repository ${name}`);
    }

    if (distribution && distribution.repository === repository.pulp_href) {
      return distribution.base_path;
    }

    distribution = await DistributionAPI.list({
      repository: repository.pulp_href,
      sort: 'pulp_created',
      page_size: 1,
    }).then(firstResult);

    if (!distribution) {
      return Promise.reject(
        t`Failed to find a distribution for repository ${name}`,
      );
    }

    return distribution.base_path;
  });
}

function firstResult({ data: { results } }) {
  return results[0];
}
