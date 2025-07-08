import { msg, t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import ArrowRightIcon from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
import { Navigate } from 'react-router';
import {
  debianRepositoryDeleteAction,
  debianRepositoryEditAction,
  debianRepositorySyncAction,
} from '../../actions';
import {
  DebianDistributionAPI,
  DebianRemoteAPI,
  type DebianRemoteType,
  DebianRepositoryAPI,
  type DebianRepositoryType,
} from '../../api';
import { PageWithTabs } from '../../components';
import { Paths, formatPath } from '../../paths';
import {
  lastSyncStatus,
  lastSynced,
  parsePulpIDFromURL,
  repositoryDistro,
} from '../../utilities';
import { RepositoryAccessTab } from './tab-access';
import { DetailsTab } from './tab-details';
import { DistributionsTab } from './tab-distributions';
// import { RepositoryVersionsTab } from './tab-repository-versions';

const DebianRepositoryDetail = PageWithTabs<
  DebianRepositoryType & { remote?: DebianRemoteType }
>({
  breadcrumbs: ({ name, tab, params: { repositoryVersion, user, group } }) =>
  ([
    { url: formatPath(Paths.debian.repository.list), name: t`Repositories` },
    { url: formatPath(Paths.debian.repository.detail, { name }), name },
    (tab === 'access' && (group || user)) ||
    (tab === 'repository-versions' && repositoryVersion)
      ? {
          url: formatPath(Paths.debian.repository.detail, { name }, { tab }),
          name: t`Versions`,
        }
      : null,
    tab === 'access' && group ? { name: t`Group ${group}` } : null,
    tab === 'access' && user ? { name: t`User ${user}` } : null,
    tab === 'repository-versions' && repositoryVersion
      ? { name: t`Version ${repositoryVersion}` }
      : null,
    (tab === 'access' && !user && !group) ||
    (tab === 'repository-versions' && !repositoryVersion)
      ? { name: t`Versions` }
      : null,
  ].filter(Boolean) as { url?: string; name: string }[]),
  displayName: 'DebianRepositoryDetail',
  errorTitle: msg`Repository could not be displayed.`,
  headerActions: [
    debianRepositoryEditAction,
    debianRepositorySyncAction,
    debianRepositoryDeleteAction,
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
  listUrl: formatPath(Paths.debian.repository.list),
  query: ({ name }) => {
    return DebianRepositoryAPI.list({ name, page_size: 1 })
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
          repositoryDistro(
            repository.name,
            repository.pulp_href,
            DebianDistributionAPI,
          ).catch(err(null)),
          DebianRepositoryAPI.myPermissions(
            parsePulpIDFromURL(repository.pulp_href),
          )
            .then(({ data: { permissions } }) => permissions)
            .catch(err([])),
          repository.remote
            ? DebianRemoteAPI.get(parsePulpIDFromURL(repository.remote))
                .then(({ data }) => data)
                .catch(() => null)
            : null,
        ]).then(([distribution, my_permissions, remote]) => ({
          ...repository,
          distribution,
          my_permissions,
          remote,
        }));
      });
  },
  renderTab: (tab, item, actionContext) =>
    ({
      details: <DetailsTab item={item} actionContext={actionContext} />,
      access: <RepositoryAccessTab item={item} actionContext={actionContext} />,
      // 'repository-versions': (
      //   <RepositoryVersionsTab item={item} actionContext={actionContext} />
      // ),
      distributions: (
        <DistributionsTab item={item} actionContext={actionContext} />
      ),
    })[tab],
  tabs: (tab, name) => [
    {
      active: tab === 'details',
      title: t`Details`,
      link: formatPath(
        Paths.debian.repository.detail,
        { name },
        { tab: 'details' },
      ),
    },
    {
      active: tab === 'access',
      title: t`Access`,
      link: formatPath(
        Paths.debian.repository.detail,
        { name },
        { tab: 'access' },
      ),
    },
    {
      active: tab === 'collection-versions',
      title: t`Collection versions`,
      link: formatPath(
        Paths.debian.repository.detail,
        { name },
        { tab: 'collection-versions' },
      ),
    },
    {
      active: tab === 'repository-versions',
      title: t`Versions`,
      link: formatPath(
        Paths.debian.repository.detail,
        { name },
        { tab: 'repository-versions' },
      ),
    },
    {
      active: tab === 'distributions',
      title: t`Distributions`,
      link: formatPath(
        Paths.debian.repository.detail,
        { name },
        { tab: 'distributions' },
      ),
    },
  ],
});

export default DebianRepositoryDetail;
