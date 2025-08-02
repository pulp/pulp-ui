import { msg, t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { Link } from 'react-router';
import {
  rpmDistributionCreateAction,
  rpmDistributionDeleteAction,
  rpmDistributionEditAction,
} from 'src/actions';
import { RPMDistributionAPI, type RPMDistributionType } from 'src/api';
import { CopyURL, ListItemActions, ListPage } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL } from 'src/utilities';

const listItemActions = [
  // Edit
  rpmDistributionEditAction,
  // Delete
  rpmDistributionDeleteAction,
];

const RPMDistributionList = ListPage<RPMDistributionType>({
  defaultPageSize: 10,
  defaultSort: '-pulp_created',
  displayName: 'RPMDistributionList',
  errorTitle: msg`Distributions could not be displayed.`,
  filterConfig: () => [
    {
      id: 'name__icontains',
      title: t`Distribution name`,
    },
  ],
  headerActions: [rpmDistributionCreateAction], // Add distribution
  listItemActions,
  noDataButton: rpmDistributionCreateAction.button,
  noDataDescription: msg`Distributions will appear once created.`,
  noDataTitle: msg`No distributions yet`,
  query: ({ params }) => RPMDistributionAPI.list(params),
  renderTableRow(item: RPMDistributionType, index: number, actionContext) {
    const { name, pulp_href } = item;
    const id = parsePulpIDFromURL(pulp_href);

    const kebabItems = listItemActions.map((action) =>
      action.dropdownItem({ ...item, id }, actionContext),
    );

    return (
      <Tr key={index}>
        <Td>
          <Link to={formatPath(Paths.rpm.distribution.detail, { name })}>
            {name}
          </Link>
        </Td>
        <Td>
          <CopyURL
            url={item.base_url || item.base_path}
          />
        </Td>
        <ListItemActions kebabItems={kebabItems} />
      </Tr>
    );
  },
  sortHeaders: [
    {
      title: msg`Distribution name`,
      type: 'alpha',
      id: 'name',
    },
    {
      title: msg`Base path`,
      type: 'alpha',
      id: 'url',
    },
  ],
  title: msg`Distributions`,
});

export default RPMDistributionList;
