import { msg, t } from '@lingui/core/macro';
import { pythonRemoteDeleteAction, pythonRemoteEditAction } from 'src/actions';
import { PythonRemoteAPI, type PythonRemoteType } from 'src/api';
import { PageWithTabs } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { DetailsTab } from './tab-details';

const PythonRemoteDetail = PageWithTabs<PythonRemoteType>({
  breadcrumbs: ({ name }) =>
    [
      { url: formatPath(Paths.python.remote.list), name: t`Remotes` },
      { url: formatPath(Paths.python.remote.detail, { name }), name },
    ].filter(Boolean),
  displayName: 'PythonRemoteDetail',
  errorTitle: msg`Remote could not be displayed.`,
  headerActions: [pythonRemoteEditAction, pythonRemoteDeleteAction],
  listUrl: formatPath(Paths.python.remote.list),
  query: ({ name }) =>
    PythonRemoteAPI.list({ name, page_size: 1 }).then(({ data }) => {
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
      link: formatPath(
        Paths.python.remote.detail,
        { name },
        { tab: 'details' },
      ),
    },
  ],
});

export default PythonRemoteDetail;
