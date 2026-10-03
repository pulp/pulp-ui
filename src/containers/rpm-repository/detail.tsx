import { msg, t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  rpmRepositoryEditAction,
  rpmRepositoryDeleteAction,
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
  pluginRepositoryBasePath,
} from 'src/utilities';
import { DetailsTab } from './tab-details';
import { DistributionsTab } from './tab-distributions';
import { RepositoryVersionsTab } from './tab-repository-versions';
import { PackagesTab } from './tab-packages';

const RPMRepositoryDetail = PageWithTabs<
  RPMRepositoryType & { remote?: RPMRemoteType }
>({
  breadcrumbs: ({ name, tab, params: { repositoryVersion } }) => {
    const crumbs = [
      { url: formatPath(Paths.rpm.repository.list), name: t`Repositories` },
      { url: formatPath(Paths.rpm.repository.detail, { name }), name },
    ];

    if (tab !== 'repository-versions') {
      return crumbs;
    }

    // Looking at a single version keeps a link back to the list of them.
    return repositoryVersion
      ? [
          ...crumbs,
          {
            url: formatPath(Paths.rpm.repository.detail, { name }, { tab }),
            name: t`Versions`,
          },
          { name: t`Version ${repositoryVersion}` },
        ]
      : [...crumbs, { name: t`Versions` }];
  },
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
      .then(({ data }) => data?.results?.[0])
      .then((repository) => {
        // There is no detail endpoint keyed by name, so a name matching nothing
        // answers 200 with an empty list. Turn that into the 404 the page already
        // knows how to render, instead of resolving with undefined.
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
            'rpm',
            repository.name,
            repository.pulp_href,
          ).catch(err(null)),
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
      packages: <PackagesTab item={item} actionContext={actionContext} />,
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
    {
      active: tab === 'packages',
      title: t`Packages`,
      link: formatPath(
        Paths.rpm.repository.detail,
        { name },
        { tab: 'packages' },
      ),
    },
  ],
});

export default RPMRepositoryDetail;
