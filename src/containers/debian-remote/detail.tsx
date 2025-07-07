import { msg, t } from '@lingui/core/macro';
import {
  debianRemoteDeleteAction,
  debianRemoteEditAction,
} from 'src/actions';
import { DebianRemoteAPI, type DebianRemoteType } from 'src/api';
import { PageWithTabs } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL } from 'src/utilities';
import { RemoteAccessTab } from './tab-access';
import { DetailsTab } from './tab-details';

const DebianRemoteDetail = PageWithTabs<DebianRemoteType>({
  breadcrumbs: ({ name, tab, params: { user, group } }) =>
    [
      { url: formatPath(Paths.debian.remote.list), name: t`Remotes` },
      { url: formatPath(Paths.debian.remote.detail, { name }), name },
      tab === 'access' && (group || user)
        ? {
            url: formatPath(Paths.debian.remote.detail, { name }, { tab }),
            name: t`Access`,
          }
        : null,
      tab === 'access' && group ? { name: t`Group ${group}` } : null,
      tab === 'access' && user ? { name: t`User ${user}` } : null,
      tab === 'access' && !user && !group ? { name: t`Access` } : null,
    ].filter(Boolean),
  displayName: 'DebianRemoteDetail',
  errorTitle: msg`Remote could not be displayed.`,
  headerActions: [
    debianRemoteEditAction,
    debianRemoteDeleteAction,
  ],
  listUrl: formatPath(Paths.debian.remote.list),
  query: ({ name }) => {
    return DebianRemoteAPI.list({ name })
      .then(({ data: { results } }) => results[0])
      .then((remote) => {
        // using the list api, so an empty array is really a 404
        if (!remote) {
          return Promise.reject({ response: { status: 404 } });
        }

        return DebianRemoteAPI.myPermissions(
          parsePulpIDFromURL(remote.pulp_href),
        )
          .then(({ data: { permissions } }) => permissions)
          .catch((e) => {
            console.error(e);
            return [];
          })
          .then((my_permissions) => ({ ...remote, my_permissions }));
      });
  },
  renderTab: (tab, item, actionContext) =>
    ({
      details: <DetailsTab item={item} actionContext={actionContext} />,
      access: <RemoteAccessTab item={item} actionContext={actionContext} />,
    })[tab],
  tabs: (tab, name) => [
    {
      active: tab === 'details',
      title: t`Details`,
      link: formatPath(
        Paths.debian.remote.detail,
        { name },
        { tab: 'details' },
      ),
    },
    {
      active: tab === 'access',
      title: t`Access`,
      link: formatPath(
        Paths.debian.remote.detail,
        { name },
        { tab: 'access' },
      ),
    },
  ],
});

export default DebianRemoteDetail;
