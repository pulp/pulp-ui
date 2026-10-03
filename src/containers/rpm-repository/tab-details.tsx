import { t } from '@lingui/core/macro';
import { Link } from 'react-router';
import { type RPMRemoteType, type RPMRepositoryType } from 'src/api';
import { CopyURL, Details, PulpLabels } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { getRepoURL } from 'src/utilities';

interface TabProps {
  item: RPMRepositoryType & {
    distroBasePath?: string;
    remote?: RPMRemoteType;
  };
  actionContext: { addAlert: (alert) => void; state: { params } };
}

export const DetailsTab = ({ item }: TabProps) => {
  return (
    <Details
      fields={[
        { label: t`Repository name`, value: item?.name },
        { label: t`Description`, value: item?.description || t`None` },
        {
          label: t`Retained version count`,
          value: item?.retain_repo_versions ?? t`All`,
        },
        {
          label: t`Repository URL`,
          value: item?.distroBasePath ? (
            <CopyURL url={getRepoURL(item.distroBasePath)} />
          ) : (
            '---'
          ),
        },
        {
          label: t`Labels`,
          value: <PulpLabels labels={item?.pulp_labels} />,
        },
        {
          label: t`Remote`,
          value: item?.remote ? item.remote.name : t`None`,
        },
        {
          label: t`Autopublish`,
          value: item?.autopublish ? t`Enabled` : t`Disabled`,
        },
        {
          label: t`Autopublish`,
          value: item?.autopublish ? t`Enabled` : t`Disabled`,
        },
        {
          label: t`Retained package versions`,
          value: item?.retain_package_versions || t`All`,
        },
      ]}
    />
  );
};
