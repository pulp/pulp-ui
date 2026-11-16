import { msg, t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { Link } from 'react-router';
import {
  pythonRemoteCreateAction,
  pythonRemoteDeleteAction,
  pythonRemoteEditAction,
} from 'src/actions';
import { PythonRemoteAPI, type PythonRemoteType } from 'src/api';
import { CopyURL, ListItemActions, ListPage } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL } from 'src/utilities';

const listItemActions = [
  // Edit
  pythonRemoteEditAction,
  // Delete
  pythonRemoteDeleteAction,
];

const PythonRemoteList = ListPage<PythonRemoteType>({
  defaultPageSize: 10,
  defaultSort: '-pulp_created',
  displayName: 'PythonRemoteList',
  errorTitle: msg`Remotes could not be displayed.`,
  filterConfig: () => [
    {
      id: 'name__icontains',
      title: t`Remote name`,
    },
  ],
  headerActions: [pythonRemoteCreateAction], // Add remote
  listItemActions,
  noDataButton: pythonRemoteCreateAction.button,
  noDataDescription: msg`Remotes will appear once created.`,
  noDataTitle: msg`No remotes yet`,
  query: ({ params }) => PythonRemoteAPI.list(params),
  renderTableRow(item: PythonRemoteType, index: number, actionContext) {
    const { name, policy, pulp_href, url } = item;
    const id = parsePulpIDFromURL(pulp_href);

    const kebabItems = listItemActions.map((action) =>
      action.dropdownItem({ ...item, id }, actionContext),
    );

    return (
      <Tr key={index}>
        <Td>
          <Link to={formatPath(Paths.python.remote.detail, { name })}>
            {name}
          </Link>
        </Td>
        <Td>
          <CopyURL url={url} />
        </Td>
        <Td>{policy || '---'}</Td>
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
    {
      title: msg`Download policy`,
      type: 'none',
      id: 'policy',
    },
  ],
  title: msg`Remotes`,
});

export default PythonRemoteList;
