import { msg, t } from '@lingui/core/macro';
import { rpmRemoteDeleteAction, rpmRemoteEditAction } from 'src/actions';
import { RPMRemoteAPI, type RPMRemoteType } from 'src/api';
import { PageWithTabs } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { DetailsTab } from './tab-details';

const RPMRemoteDetail = PageWithTabs<RPMRemoteType>({
  breadcrumbs: ({ name }) =>
    [
      { url: formatPath(Paths.rpm.remote.list), name: t`Remotes` },
      { url: formatPath(Paths.rpm.remote.detail, { name }), name },
    ].filter(Boolean),
  displayName: 'RPMRemoteDetail',
  errorTitle: msg`Remote could not be displayed.`,
  headerActions: [rpmRemoteEditAction, rpmRemoteDeleteAction],
  listUrl: formatPath(Paths.rpm.remote.list),
  query: ({ name }) =>
    RPMRemoteAPI.list({ name, page_size: 1 }).then(({ data }) => {
      const remote = data?.results?.[0];

      // There is no detail endpoint keyed by name, so a name matching nothing
      // answers 200 with an empty list. Turn that into the 404 the page already
      // knows how to render, instead of resolving with undefined.
      if (!remote) {
        return Promise.reject({ response: { status: 404 } });
      }

      return remote;
    }),
  renderTab: (tab, item, actionContext) =>
    ({
      details: <DetailsTab item={item} actionContext={actionContext} />,
    })[tab],
  tabs: (tab, name) => [
    {
      active: tab === 'details',
      title: t`Details`,
      link: formatPath(Paths.rpm.remote.detail, { name }, { tab: 'details' }),
    },
  ],
});

export default RPMRemoteDetail;
