import { msg, t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { Link } from 'react-router';
import {
  rpmRemoteCreateAction,
  rpmRemoteDeleteAction,
  rpmRemoteEditAction,
} from 'src/actions';
import { RPMRemoteAPI, type RPMRemoteType } from 'src/api';
import { CopyURL, ListItemActions, ListPage } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL } from 'src/utilities';

const listItemActions = [
  // Edit
  rpmRemoteEditAction,
  // Delete
  rpmRemoteDeleteAction,
];

const RPMRemoteList = ListPage<RPMRemoteType>({
  defaultPageSize: 10,
  defaultSort: '-pulp_created',
  displayName: 'RPMRemoteList',
  errorTitle: msg`Remotes could not be displayed.`,
  filterConfig: () => [
    {
      id: 'name__icontains',
      title: t`Remote name`,
    },
  ],
  headerActions: [rpmRemoteCreateAction], // Add remote
  listItemActions,
  noDataButton: rpmRemoteCreateAction.button,
  noDataDescription: msg`Remotes will appear once created.`,
  noDataTitle: msg`No remotes yet`,
  query: ({ params }) => RPMRemoteAPI.list(params),
  renderTableRow(item: RPMRemoteType, index: number, actionContext) {
    const { name, pulp_href, url } = item;
    const id = parsePulpIDFromURL(pulp_href);

    const kebabItems = listItemActions.map((action) =>
      action.dropdownItem({ ...item, id }, actionContext),
    );

    return (
      <Tr key={index}>
        <Td>
          <Link to={formatPath(Paths.rpm.remote.detail, { name })}>
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

export default RPMRemoteList;
