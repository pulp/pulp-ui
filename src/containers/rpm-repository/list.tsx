import { msg, t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { Link } from 'react-router';
import { rpmRepositoryCreateAction } from 'src/actions';
import { RPMRepositoryAPI, type RPMRepositoryType } from 'src/api';
import {
  DateComponent,
  ListItemActions,
  ListPage,
  PulpLabels,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL } from 'src/utilities';

const RPMRepositoryList = ListPage<RPMRepositoryType>({
  defaultPageSize: 10,
  defaultSort: '-pulp_created',
  displayName: 'RPMRepositoryList',
  errorTitle: msg`Repositories could not be displayed.`,
  filterConfig: () => [
    {
      id: 'name__icontains',
      title: t`Repository name`,
    },
    {
      id: 'pulp_label_select',
      title: t`Pulp Label`,
    },
  ],
  headerActions: [rpmRepositoryCreateAction],
  noDataButton: rpmRepositoryCreateAction.button,
  noDataDescription: msg`Repositories will appear once created.`,
  noDataTitle: msg`No repositories yet`,
  query: ({ params }) => RPMRepositoryAPI.list(params),
  renderTableRow(item: RPMRepositoryType, index: number) {
    const { name, pulp_created, pulp_href, pulp_labels } = item;
    const id = parsePulpIDFromURL(pulp_href);

    return (
      <Tr key={index}>
        <Td>
          <Link to={formatPath(Paths.rpm.repository.detail, { name })}>
            {name}
          </Link>
        </Td>
        <Td>
          <PulpLabels labels={pulp_labels} />
        </Td>
        <Td>
          <DateComponent date={pulp_created} />
        </Td>
        <ListItemActions kebabItems={[]} />
      </Tr>
    );
  },
  sortHeaders: [
    {
      title: msg`Repository name`,
      type: 'alpha',
      id: 'name',
    },
    {
      title: msg`Labels`,
      type: 'none',
      id: 'pulp_labels',
    },
    {
      title: msg`Created date`,
      type: 'numeric',
      id: 'pulp_created',
    },
  ],
  title: msg`Repositories`,
});

export default RPMRepositoryList;
