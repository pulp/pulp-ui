import { msg, t } from '@lingui/core/macro';
import { fileRemoteDeleteAction, fileRemoteEditAction } from 'src/actions';
import { FileRemoteAPI, type FileRemoteType } from 'src/api';
import { PageWithTabs } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { DetailsTab } from './tab-details';

const FileRemoteDetail = PageWithTabs<FileRemoteType>({
  breadcrumbs: ({ name }) =>
    [
      { url: formatPath(Paths.file.remote.list), name: t`Remotes` },
      { url: formatPath(Paths.file.remote.detail, { name }), name },
    ].filter(Boolean),
  displayName: 'FileRemoteDetail',
  errorTitle: msg`Remote could not be displayed.`,
  headerActions: [fileRemoteEditAction, fileRemoteDeleteAction],
  listUrl: formatPath(Paths.file.remote.list),
  query: ({ name }) =>
    FileRemoteAPI.list({ name })
      .then(({ data: { results } }) => results[0])
      .then(
        (remote) =>
          remote ||
          // using the list api, so an empty array is really a 404
          Promise.reject({ response: { status: 404 } }),
      ),
  renderTab: (tab, item, actionContext) =>
    ({
      details: <DetailsTab item={item} actionContext={actionContext} />,
    })[tab],
  tabs: (tab, name) => [
    {
      active: tab === 'details',
      title: t`Details`,
      link: formatPath(Paths.file.remote.detail, { name }, { tab: 'details' }),
    },
  ],
});

export default FileRemoteDetail;
