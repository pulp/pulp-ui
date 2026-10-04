import { msg, t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { Link } from 'react-router';
import {
  pythonRepositoryCreateAction,
  pythonRepositoryDeleteAction,
  pythonRepositoryEditAction,
  pythonRepositorySyncAction,
} from 'src/actions';
import {
  PythonRemoteAPI,
  PythonRepositoryAPI,
  type PythonRepositoryType,
} from 'src/api';
import {
  DateComponent,
  ListItemActions,
  ListPage,
  PulpLabels,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL } from 'src/utilities';

const listItemActions = [
  // Edit
  pythonRepositoryEditAction,
  // Sync
  pythonRepositorySyncAction,
  // Delete
  pythonRepositoryDeleteAction,
];

const typeaheadQuery = ({ inputText, selectedFilter, setState }) => {
  if (selectedFilter !== 'remote') {
    return;
  }

  return PythonRemoteAPI.list({ name__icontains: inputText })
    .then(({ data: { results } }) =>
      results.map(({ name, pulp_href }) => ({ id: pulp_href, title: name })),
    )
    .then((remotes) => setState({ remotes }));
};

const PythonRepositoryList = ListPage<PythonRepositoryType>({
  defaultPageSize: 10,
  defaultSort: '-pulp_created',
  displayName: 'PythonRepositoryList',
  errorTitle: msg`Repositories could not be displayed.`,
  filterConfig: ({ state: { remotes } }) => [
    {
      id: 'name__icontains',
      title: t`Repository name`,
    },
    {
      id: 'pulp_label_select',
      title: t`Pulp Label`,
    },
    {
      id: 'remote',
      title: t`Remote`,
      inputType: 'typeahead',
      options: [
        {
          id: 'null',
          title: t`None`,
        },
        ...(remotes || []),
      ],
    },
  ],
  headerActions: [pythonRepositoryCreateAction], // Add repository
  listItemActions,
  noDataButton: pythonRepositoryCreateAction.button,
  noDataDescription: msg`Repositories will appear once created.`,
  noDataTitle: msg`No repositories yet`,
  query: ({ params }) => PythonRepositoryAPI.list(params),
  typeaheadQuery,
  renderTableRow(item: PythonRepositoryType, index: number, actionContext) {
    const { name, pulp_created, pulp_href, pulp_labels } = item;
    const id = parsePulpIDFromURL(pulp_href);

    const kebabItems = listItemActions.map((action) =>
      action.dropdownItem({ ...item, id }, actionContext),
    );

    return (
      <Tr key={index}>
        <Td>
          <Link to={formatPath(Paths.python.repository.detail, { name })}>
            {name}
          </Link>
        </Td>
        <Td>
          <PulpLabels labels={pulp_labels} />
        </Td>
        <Td>
          <DateComponent date={pulp_created} />
        </Td>
        <ListItemActions kebabItems={kebabItems} />
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

export default PythonRepositoryList;
