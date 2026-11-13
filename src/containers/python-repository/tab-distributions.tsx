import { t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { PythonDistributionAPI, type PythonRepositoryType } from 'src/api';
import { ClipboardCopy, DateComponent, DetailList } from 'src/components';

interface TabProps {
  item: PythonRepositoryType;
  actionContext: {
    addAlert: (alert) => void;
    state: { params };
    hasPermission;
  };
}

interface Distribution {
  base_path: string;
  base_url: string;
  client_url: string;
  content_guard: string;
  name: string;
  pulp_created: string;
  pulp_href: string;
  pulp_labels: Record<string, string>;
  repository: string;
  repository_version: string;
}

export const DistributionsTab = ({
  item,
  actionContext: { addAlert, hasPermission },
}: TabProps) => {
  const query = ({ params } = { params: null }) => {
    const newParams = { ...params };
    newParams.ordering = newParams.sort;
    delete newParams.sort;

    return PythonDistributionAPI.list({
      repository: item.pulp_href,
      ...newParams,
    });
  };

  // pulp_python reports where pip should look as the distribution's base_url;
  // the simple index lives under it.
  const cliConfig = (base_url) =>
    `pip install --index-url ${base_url}simple/ <package>`;

  const renderTableRow = (
    item: Distribution,
    index: number,
    _actionContext,
  ) => {
    const { name, base_path, base_url, pulp_created } = item;

    return (
      <Tr key={index}>
        <Td>{name}</Td>
        <Td>{base_path}</Td>
        <Td>
          <DateComponent date={pulp_created} />
        </Td>
        <Td>
          <ClipboardCopy
            isCode
            isReadOnly
            variant={'inline-compact'}
            key={index}
          >
            {cliConfig(base_url)}
          </ClipboardCopy>
        </Td>
      </Tr>
    );
  };

  return (
    <DetailList<Distribution>
      actionContext={{
        addAlert,
        query,
        hasPermission,
        // No hasObjectPermission: nothing in this list is gated on one. Python
        // repositories do carry my_permissions, so an action added here later
        // can check it properly rather than stubbing it.
      }}
      defaultPageSize={10}
      defaultSort={'name'}
      errorTitle={t`Distributions could not be displayed.`}
      filterConfig={[
        {
          id: 'name__icontains',
          title: t`Name`,
        },
        {
          id: 'base_path__icontains',
          title: t`Base path`,
        },
      ]}
      noDataDescription={t`You can edit this repository to create a distribution.`}
      noDataTitle={t`No distributions created`}
      query={query}
      renderTableRow={renderTableRow}
      sortHeaders={[
        {
          title: t`Name`,
          type: 'alpha',
          id: 'name',
        },
        {
          title: t`Base path`,
          type: 'alpha',
          id: 'base_path',
        },
        {
          title: t`Created`,
          type: 'alpha',
          id: 'pulp_created',
        },
        {
          title: t`Install with pip`,
          type: 'none',
          id: '',
        },
      ]}
      title={t`Distributions`}
    />
  );
};
