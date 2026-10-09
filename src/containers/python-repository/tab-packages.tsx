import { t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { PythonPackageAPI, type PythonRepositoryType } from 'src/api';
import { DetailList } from 'src/components';

interface TabProps {
  item: PythonRepositoryType;
  actionContext: {
    addAlert: (alert) => void;
    state: { params };
    hasPermission;
  };
}

interface PythonPackage {
  name: string;
  version: string;
  packagetype: string;
  filename: string;
  requires_python: string;
  pulp_href: string;
}

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

    return PythonPackageAPI.list({
      repository_version: item.latest_version_href,
      fields: 'name,version,packagetype,filename,requires_python,pulp_href',
      ...newParams,
    });
  };

  // one release usually has several files (an sdist and per-platform wheels);
  // the filename is what tells them apart
  const renderTableRow = (
    pkg: PythonPackage,
    index: number,
    _actionContext,
  ) => (
    <Tr key={index}>
      <Td>{pkg.name}</Td>
      <Td>{pkg.version}</Td>
      <Td>{pkg.packagetype}</Td>
      <Td>{pkg.filename}</Td>
      <Td>{pkg.requires_python || '---'}</Td>
    </Tr>
  );

  return (
    <DetailList<PythonPackage>
      actionContext={{ addAlert, query, hasPermission }}
      defaultPageSize={20}
      defaultSort={'name'}
      errorTitle={t`Packages could not be displayed.`}
      filterConfig={[
        { id: 'name__contains', title: t`Package name` },
        { id: 'packagetype', title: t`Package type` },
        { id: 'requires_python__contains', title: t`Requires Python` },
      ]}
      noDataDescription={t`Sync this repository or upload packages to it.`}
      noDataTitle={t`No packages in the latest version`}
      query={query}
      renderTableRow={renderTableRow}
      sortHeaders={[
        { title: t`Name`, type: 'alpha', id: 'name' },
        { title: t`Version`, type: 'none', id: 'version' },
        { title: t`Type`, type: 'none', id: 'packagetype' },
        { title: t`File`, type: 'none', id: 'filename' },
        { title: t`Requires Python`, type: 'none', id: 'requires_python' },
      ]}
      title={t`Packages`}
    />
  );
};
