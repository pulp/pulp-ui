import { msg, t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { Link } from 'react-router';
import {
  debianRepositoryCreateAction,
  debianRepositoryDeleteAction,
  debianRepositoryEditAction,
  debianRepositorySyncAction,
} from 'src/actions';
import {
  DebianRemoteAPI,
  DebianRepositoryAPI,
  type DebianRepositoryType,
} from 'src/api';
import {
  DateComponent,
  ListItemActions,
  ListPage,
  PulpLabels,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { lastSyncStatus, lastSynced, parsePulpIDFromURL } from 'src/utilities';

const listItemActions = [
  // Edit
  debianRepositoryEditAction,
  // Sync
  debianRepositorySyncAction,
  // Copy CLI configuration
  debianRepositoryCreateAction,
  // Delete
  debianRepositoryDeleteAction,
];

const typeaheadQuery = ({ inputText, selectedFilter, setState }) => {
  if (selectedFilter !== 'remote') {
    return;
  }

  return DebianRemoteAPI.list({ name__icontains: inputText })
    .then(({ data: { results } }) =>
      results.map(({ name, pulp_href }) => ({ id: pulp_href, title: name })),
    )
    .then((remotes) => setState({ remotes }));
};

const DebianRepositoryList = ListPage<DebianRepositoryType>({
  defaultPageSize: 10,
  defaultSort: '-pulp_created',
  displayName: 'DebianRepositoryList',
  errorTitle: msg`Repositories could not be displayed.`,
  filterConfig: ({ state: { remotes } }) => [
    {
      id: 'name__icontains',
      title: t`Repository name`,
    },
    {
      id: 'pulp_label_select',
      title: t`Pulp label`,
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
  headerActions: [debianRepositoryCreateAction], // Add repository
  listItemActions,
  noDataButton: debianRepositoryCreateAction.button,
  noDataDescription: msg`Repositories will appear once created.`,
  noDataTitle: msg`No repositories yet`,
  query: ({ params }) => DebianRepositoryAPI.list(params),
  typeaheadQuery,
  renderTableRow(item: DebianRepositoryType, index: number, actionContext) {
    const {
      last_sync_task,
      name,
      private: isPrivate,
      pulp_created,
      pulp_href,
      pulp_labels,
      remote,
    } = item;
    const id = parsePulpIDFromURL(pulp_href);

    const kebabItems = listItemActions.map((action) =>
      action.dropdownItem({ ...item, id }, actionContext),
    );

    return (
      <Tr key={index}>
        <Td>
          <Link to={formatPath(Paths.debian.repository.detail, { name })}>
            {name}
          </Link>
        </Td>
        <Td>
          <PulpLabels labels={pulp_labels} />
        </Td>
        <Td>{isPrivate ? t`Yes` : t`No`}</Td>
        <Td>
          {!remote ? (
            t`no remote`
          ) : !last_sync_task ? (
            t`never synced`
          ) : (
            <>
              {lastSyncStatus(item)} {lastSynced(item)}
            </>
          )}
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
      title: msg`Private`,
      type: 'none',
      id: 'private',
    },
    {
      title: msg`Sync status`,
      type: 'none',
      id: 'last_sync_task',
    },
    {
      title: msg`Created date`,
      type: 'numeric',
      id: 'pulp_created',
    },
  ],
  title: msg`Repositories`,
});

export default DebianRepositoryList;
