import { t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { ContainerDistributionAPI } from 'src/api';
import { ClipboardCopy, DateComponent, DetailList } from 'src/components';
import { getContainersURL } from 'src/utilities';
import { type ContainerDetailTabProps } from './execution-environment-detail-native';

interface DistributionType {
  pulp_href: string;
  pulp_created: string;
  name: string;
  base_path: string;
  registry_path: string;
  repository: string | null;
  remote: string | null;
}

export const DistributionsTab = ({
  item,
  actionContext: { addAlert, hasPermission },
}: ContainerDetailTabProps) => {
  const query = ({ params } = { params: null }) => {
    const newParams = { ...params };
    newParams.ordering = newParams.sort;
    delete newParams.sort;

    const relationFilter = item.repository?.pulp_href
      ? { repository: item.repository.pulp_href }
      : { base_path: item.base_path };

    return ContainerDistributionAPI.list({
      ...relationFilter,
      ...newParams,
    });
  };

  const cliConfig = (basePath: string) =>
    `podman pull ${getContainersURL({ name: basePath, tag: 'latest' })}`;

  const renderTableRow = (distribution: DistributionType, index: number) => {
    const { name, base_path, pulp_created } = distribution;

    return (
      <Tr key={index}>
        <Td>{name}</Td>
        <Td>{base_path}</Td>
        <Td>
          <DateComponent date={pulp_created} />
        </Td>
        <Td>
          <ClipboardCopy isCode isReadOnly variant='inline-compact' key={index}>
            {cliConfig(base_path)}
          </ClipboardCopy>
        </Td>
      </Tr>
    );
  };

  return (
    <DetailList<DistributionType>
      actionContext={{
        addAlert,
        query,
        hasPermission,
        hasObjectPermission: (_permission: string): boolean => true,
      }}
      defaultPageSize={10}
      defaultSort='name'
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
      noDataDescription={t`No distributions found for this container repository.`}
      noDataTitle={t`No distributions yet`}
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
          title: t`CLI configuration`,
          type: 'none',
          id: '',
        },
      ]}
      title={t`Distributions`}
    />
  );
};
