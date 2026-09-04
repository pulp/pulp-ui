import { msg, t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { Link } from 'react-router';
import {
  debRemoteCreateAction,
  debRemoteDeleteAction,
  debRemoteEditAction,
} from 'src/actions';
import { DebRemoteAPI, type DebRemoteType } from 'src/api';
import { CopyURL, ListItemActions, ListPage } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL } from 'src/utilities';

const listItemActions = [
  // Edit
  debRemoteEditAction,
  // Delete
  debRemoteDeleteAction,
];

const DebRemoteList = ListPage<DebRemoteType>({
  defaultPageSize: 10,
  defaultSort: '-pulp_created',
  displayName: 'DebRemoteList',
  errorTitle: msg`Remotes could not be displayed.`,
  filterConfig: () => [
    {
      id: 'name__icontains',
      title: t`Remote name`,
    },
  ],
  headerActions: [debRemoteCreateAction], // Add remote
  listItemActions,
  noDataButton: debRemoteCreateAction.button,
  noDataDescription: msg`Remotes will appear once created.`,
  noDataTitle: msg`No remotes yet`,
  query: ({ params }) => DebRemoteAPI.list(params),
  renderTableRow(item: DebRemoteType, index: number, actionContext) {
    const { distributions, name, pulp_href, url } = item;
    const id = parsePulpIDFromURL(pulp_href);

    const kebabItems = listItemActions.map((action) =>
      action.dropdownItem({ ...item, id }, actionContext),
    );

    return (
      <Tr key={index}>
        <Td>
          <Link to={formatPath(Paths.deb.remote.detail, { name })}>{name}</Link>
        </Td>
        <Td>
          <CopyURL url={url} />
        </Td>
        <Td>{distributions || '---'}</Td>
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
      title: msg`Distributions`,
      type: 'none',
      id: 'distributions',
    },
  ],
  title: msg`Remotes`,
});

export default DebRemoteList;
