import { msg, t } from '@lingui/core/macro';
import { Td, Tr } from '@patternfly/react-table';
import { PythonPackageAPI } from 'src/api';
import { LazyRepositories, ListPage } from 'src/components';

interface PythonPackage {
  name: string;
  version: string;
  packagetype: string;
  filename: string;
  pulp_href: string;
}

const PythonPackageList = ListPage<PythonPackage>({
  defaultPageSize: 10,
  defaultSort: 'name',
  displayName: 'PythonPackageList',
  errorTitle: msg`Packages could not be displayed.`,
  filterConfig: (_) => [
    { id: 'name__contains', title: t`Package name` },
    { id: 'packagetype', title: t`Package type` },
  ],
  noDataDescription: msg`Packages will appear once a repository is synced or a package is uploaded.`,
  noDataTitle: msg`No packages yet`,
  query: ({ params }) =>
    PythonPackageAPI.list({
      fields: 'name,version,packagetype,filename,pulp_href',
      ...params,
    }),
  renderTableRow(item: PythonPackage, index: number) {
    const { name, version, packagetype, filename, pulp_href } = item;

    return (
      <Tr key={index}>
        <Td>{name}</Td>
        <Td>{version}</Td>
        <Td>{packagetype}</Td>
        <Td>{filename}</Td>
        <Td>
          <LazyRepositories plugin='python' content_href={pulp_href} />
        </Td>
      </Tr>
    );
  },
  sortHeaders: [
    { title: msg`Package name`, type: 'alpha', id: 'name' },
    { title: msg`Version`, type: 'none', id: 'version' },
    { title: msg`Type`, type: 'none', id: 'packagetype' },
    { title: msg`File`, type: 'none', id: 'filename' },
    { title: msg`Repository`, type: 'none', id: 'repository' },
  ],
  title: msg`Packages`,
});

export default PythonPackageList;
