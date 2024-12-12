import { msg, t } from '@lingui/macro';
import { Td, Tr } from '@patternfly/react-table';
import { RPMPackageAPI } from 'src/api';
import { LazyRPMRepository, ListItemActions, ListPage } from 'src/components';

interface RPMPackage {
  name: string;
  version;
  arch;
  pulp_href;
}

const listItemActions = [];

const RPMPackageList = ListPage<RPMPackage>({
  defaultPageSize: 10,
  defaultSort: '-name',
  displayName: 'RPMPackageList',
  errorTitle: msg`Packages could not be displayed.`,
  filterConfig: (_) => [
    {
      id: 'name__contains',
      title: t`Package name`,
    },
  ],
  headerActions: [],
  listItemActions,
  noDataDescription: msg`Packages will appear once created.`,
  noDataTitle: msg`No packages yet`,
  query: ({ params }) => RPMPackageAPI.list(params),
  renderTableRow(item: RPMPackage, index: number, _actionContext) {
    const { name, version, arch, pulp_href } = item;

    // TODO download rpm
    const kebabItems = []; /* listItemActions.map((action) =>
      action.dropdownItem({ ...item, id }, actionContext),
    ); */

    return (
      <Tr key={index}>
        <Td>{name}</Td>
        <Td>{version}</Td>
        <Td>{arch}</Td>
        <Td>
          <LazyRPMRepository content_href={pulp_href} />
        </Td>
        <ListItemActions kebabItems={kebabItems} />
      </Tr>
    );
  },
  sortHeaders: [
    {
      title: msg`Package name`,
      type: 'alpha',
      id: 'name',
    },
    {
      title: msg`Version`,
      type: 'none',
      id: 'version',
    },
    {
      title: msg`Arch`,
      type: 'none',
      id: 'arch',
    },
    {
      title: msg`Repository`,
      type: 'none',
      id: 'repository',
    },
  ],
  title: msg`Packages`,
});

export default RPMPackageList;
