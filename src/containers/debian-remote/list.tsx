import { msg, t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { Link } from 'react-router';
import {
  debianRemoteCreateAction,
  debianRemoteDeleteAction
} from '../../actions';
import { DebianRemoteAPI, type DebianRemoteType } from '../../api';
import { CopyURL, ListItemActions, ListPage } from '../../components';
import { Paths, formatPath } from '../../paths';
import { parsePulpIDFromURL } from '../../utilities';

const listItemActions = [
  // Delete
  debianRemoteDeleteAction,
];

const DebianRemoteList = ListPage<DebianRemoteType>({
  defaultPageSize: 10,
  defaultSort: '-pulp_created',
  displayName: 'DebianRemoteList',
  errorTitle: msg`Remotes could not be displayed.`,
  filterConfig: () => [
    {
      id: 'name__icontains',
      title: t`Remote name`,
    },
  ],
  headerActions: [debianRemoteCreateAction], // Add remote
  listItemActions,
  noDataButton: debianRemoteCreateAction.button,
  noDataDescription: msg`Remotes will appear once created.`,
  noDataTitle: msg`No remotes yet`,
  query: ({ params }) => DebianRemoteAPI.list(params),
  renderTableRow(item: DebianRemoteType, index: number, actionContext) {
    const { name, pulp_href, url , components} = item;
    console.log(item)
    const id = parsePulpIDFromURL(pulp_href);

    const kebabItems = listItemActions.map((action) =>
      action.dropdownItem({ ...item, id }, actionContext),
    );
    console.log(item)
    return (
      <Tr key={index}>

        <Td>
          <Link to={formatPath(Paths.debian.remote.detail, { name })}>
            {name}
          </Link>
        </Td>
        <Td>
          <CopyURL url={formatPath(url, {name:components })+components} />
        </Td>
        <ListItemActions kebabItems={kebabItems}/>
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

export default DebianRemoteList;
