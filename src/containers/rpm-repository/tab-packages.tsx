import { t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { RPMPackageAPI, type RPMRepositoryType } from 'src/api';
import { DetailList } from 'src/components';

interface TabProps {
  item: RPMRepositoryType;
  actionContext: {
    addAlert: (alert) => void;
    state: { params };
    hasPermission;
  };
}

interface RPMPackage {
  name: string;
  epoch: string;
  version: string;
  release: string;
  arch: string;
  summary: string;
  pulp_href: string;
}

// epoch:version-release, with epoch omitted when 0, as rpm/dnf display it
const evr = ({ epoch, version, release }: RPMPackage) =>
  `${epoch && epoch !== '0' ? `${epoch}:` : ''}${version}-${release}`;

export const PackagesTab = ({
  item,
  actionContext: { addAlert, hasPermission },
}: TabProps) => {
  const query = ({ params } = { params: null }) => {
    // without repository_version, Pulp would list every package on the server
    if (!item.latest_version_href) {
      return Promise.resolve({ data: { count: 0, results: [] } });
    }

    const newParams = { ...params };
    newParams.ordering = newParams.sort;
    delete newParams.sort;

    return RPMPackageAPI.list({
      repository_version: item.latest_version_href,
      fields: 'name,epoch,version,release,arch,summary,pulp_href',
      ...newParams,
    });
  };

  const renderTableRow = (pkg: RPMPackage, index: number, _actionContext) => (
    <Tr key={index}>
      <Td>{pkg.name}</Td>
      <Td>{evr(pkg)}</Td>
      <Td>{pkg.arch}</Td>
      <Td>{pkg.summary}</Td>
    </Tr>
  );

  return (
    <DetailList<RPMPackage>
      actionContext={{ addAlert, query, hasPermission }}
      defaultPageSize={20}
      defaultSort={'name'}
      errorTitle={t`Packages could not be displayed.`}
      filterConfig={[
        { id: 'name__contains', title: t`Package name` },
        { id: 'arch', title: t`Arch` },
      ]}
      noDataDescription={t`Sync this repository or add packages to it.`}
      noDataTitle={t`No packages in the latest version`}
      query={query}
      renderTableRow={renderTableRow}
      sortHeaders={[
        { title: t`Name`, type: 'alpha', id: 'name' },
        { title: t`Version`, type: 'none', id: 'version' },
        { title: t`Arch`, type: 'none', id: 'arch' },
        { title: t`Summary`, type: 'none', id: 'summary' },
      ]}
      title={t`Packages`}
    />
  );
};