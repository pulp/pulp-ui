import { msg, t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  rpmRepositoryDeleteAction,
  rpmRepositoryEditAction,
  rpmRepositorySyncAction,
} from 'src/actions';
import {
  RPMRemoteAPI,
  type RPMRemoteType,
  RPMRepositoryAPI,
  type RPMRepositoryType,
} from 'src/api';
import { PageWithTabs } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  lastSyncStatus,
  lastSynced,
  parsePulpIDFromURL,
  repositoryBasePath,
} from 'src/utilities';
import { DetailsTab } from './tab-details';
import { DistributionsTab } from './tab-distributions';
import { RepositoryVersionsTab } from './tab-repository-versions';

const RPMRepositoryDetail = PageWithTabs<
  RPMRepositoryType & { remote?: RPMRemoteType }
>({
  breadcrumbs: ({ name, tab, params: { repositoryVersion } }) =>
    [
      { url: formatPath(Paths.rpm.repository.list), name: t`Repositories` },
      { url: formatPath(Paths.rpm.repository.detail, { name }), name },
      tab === 'repository-versions' && repositoryVersion
        ? {
            url: formatPath(Paths.rpm.repository.detail, { name }, { tab }),
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
  displayName: 'RPMRepositoryDetail',
  errorTitle: msg`Repository could not be displayed.`,
  headerActions: [
    rpmRepositoryEditAction,
    rpmRepositorySyncAction,
    rpmRepositoryDeleteAction,
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
  listUrl: formatPath(Paths.rpm.repository.list),
  query: ({ name }) =>
    RPMRepositoryAPI.list({ name, page_size: 1 })
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
          repositoryBasePath(repository.name, repository.pulp_href).catch(
            err(null),
          ),
          repository.remote
            ? RPMRemoteAPI.get(parsePulpIDFromURL(repository.remote))
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
        Paths.rpm.repository.detail,
        { name },
        { tab: 'details' },
      ),
    },
    {
      active: tab === 'repository-versions',
      title: t`Versions`,
      link: formatPath(
        Paths.rpm.repository.detail,
        { name },
        { tab: 'repository-versions' },
      ),
    },
    {
      active: tab === 'distributions',
      title: t`Distributions`,
      link: formatPath(
        Paths.rpm.repository.detail,
        { name },
        { tab: 'distributions' },
      ),
    },
  ],
});

export default RPMRepositoryDetail;
