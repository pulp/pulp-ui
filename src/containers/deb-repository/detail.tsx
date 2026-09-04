import { msg, t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  debRepositoryDeleteAction,
  debRepositoryEditAction,
  debRepositorySyncAction,
} from 'src/actions';
import {
  DebRemoteAPI,
  type DebRemoteType,
  DebRepositoryAPI,
  type DebRepositoryType,
} from 'src/api';
import { PageWithTabs } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  lastSyncStatus,
  lastSynced,
  parsePulpIDFromURL,
  pluginRepositoryBasePath,
} from 'src/utilities';
import { DetailsTab } from './tab-details';
import { DistributionsTab } from './tab-distributions';
import { RepositoryVersionsTab } from './tab-repository-versions';

const DebRepositoryDetail = PageWithTabs<
  DebRepositoryType & { remote?: DebRemoteType }
>({
  breadcrumbs: ({ name, tab, params: { repositoryVersion } }) =>
    [
      { url: formatPath(Paths.deb.repository.list), name: t`Repositories` },
      { url: formatPath(Paths.deb.repository.detail, { name }), name },
      tab === 'repository-versions' && repositoryVersion
        ? {
            url: formatPath(Paths.deb.repository.detail, { name }, { tab }),
            name: t`Versions`,
          }
        : null,
      tab === 'repository-versions' && repositoryVersion
        ? { name: t`Version ${repositoryVersion}` }
        : null,
      tab === 'repository-versions' && !repositoryVersion
        ? { name: t`Versions` }
        : null,
    ].filter(Boolean),
  displayName: 'DebRepositoryDetail',
  errorTitle: msg`Repository could not be displayed.`,
  headerActions: [
    debRepositoryEditAction,
    debRepositorySyncAction,
    debRepositoryDeleteAction,
  ],
  headerDetails: (item) => (
    <>
      {item?.last_sync_task && (
        <p className='pulp-m-truncated'>
          <Trans>Last updated from registry {lastSynced(item)}</Trans>{' '}
          {lastSyncStatus(item)}
        </p>
      )}
    </>
  ),
  listUrl: formatPath(Paths.deb.repository.list),
  query: ({ name }) =>
    DebRepositoryAPI.list({ name, page_size: 1 })
      .then(({ data: { results } }) => results[0])
      .then((repository) => {
        // using the list api, so an empty array is really a 404
        if (!repository) {
          return Promise.reject({ response: { status: 404 } });
        }

        const err = (val) => (e) => {
          console.error(e);
          return val;
        };

        return Promise.all([
          // the plugin-aware variant, so the deb distribution endpoint is the
          // one consulted
          pluginRepositoryBasePath(
            'deb',
            repository.name,
            repository.pulp_href,
          ).catch(err(null)),
          repository.remote
            ? DebRemoteAPI.get(parsePulpIDFromURL(repository.remote))
                .then(({ data }) => data)
                .catch(() => null)
            : null,
        ]).then(([distroBasePath, remote]) => ({
          ...repository,
          distroBasePath,
          remote,
        }));
      }),
  renderTab: (tab, item, actionContext) =>
    ({
      details: <DetailsTab item={item} actionContext={actionContext} />,
      'repository-versions': (
        <RepositoryVersionsTab item={item} actionContext={actionContext} />
      ),
      distributions: (
        <DistributionsTab item={item} actionContext={actionContext} />
      ),
    })[tab],
  tabs: (tab, name) => [
    {
      active: tab === 'details',
      title: t`Details`,
      link: formatPath(
        Paths.deb.repository.detail,
        { name },
        { tab: 'details' },
      ),
    },
    {
      active: tab === 'repository-versions',
      title: t`Versions`,
      link: formatPath(
        Paths.deb.repository.detail,
        { name },
        { tab: 'repository-versions' },
      ),
    },
    {
      active: tab === 'distributions',
      title: t`Distributions`,
      link: formatPath(
        Paths.deb.repository.detail,
        { name },
        { tab: 'distributions' },
      ),
    },
  ],
});

export default DebRepositoryDetail;
