import { msg, t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { Link } from 'react-router';
import {
  fileRemoteCreateAction,
  fileRemoteDeleteAction,
  fileRemoteEditAction,
} from 'src/actions';
import { FileRemoteAPI, type FileRemoteType } from 'src/api';
import { CopyURL, ListItemActions, ListPage } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL } from 'src/utilities';

const listItemActions = [
  // Edit
  fileRemoteEditAction,
  // Delete
  fileRemoteDeleteAction,
];

const FileRemoteList = ListPage<FileRemoteType>({
  defaultPageSize: 10,
  defaultSort: '-pulp_created',
  displayName: 'FileRemoteList',
  errorTitle: msg`Remotes could not be displayed.`,
  filterConfig: () => [
    {
      id: 'name__icontains',
      title: t`Remote name`,
    },
  ],
  headerActions: [fileRemoteCreateAction], // Add remote
  listItemActions,
  noDataButton: fileRemoteCreateAction.button,
  noDataDescription: msg`Remotes will appear once created.`,
  noDataTitle: msg`No remotes yet`,
  query: ({ params }) => FileRemoteAPI.list(params),
  renderTableRow(item: FileRemoteType, index: number, actionContext) {
    const { name, pulp_href, url } = item;
    const id = parsePulpIDFromURL(pulp_href);

    const kebabItems = listItemActions.map((action) =>
      action.dropdownItem({ ...item, id }, actionContext),
    );

    return (
      <Tr key={index}>
        <Td>
          <Link to={formatPath(Paths.file.remote.detail, { name })}>
            {name}
          </Link>
        </Td>
        <Td>
          <CopyURL url={url} />
        </Td>
        <ListItemActions kebabItems={kebabItems} />
      </Tr>
    );
  },
  sortHeaders: [
    {
      title: msg`Remote name`,
      type: 'alpha',
      id: 'name',
    },
    {
      title: msg`URL`,
      type: 'alpha',
      id: 'url',
    },
  ],
  title: msg`Remotes`,
});

export default FileRemoteList;
