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
        { label: t`Created`, value: item?.pulp_created },
        { label: t`Last updated`, value: item?.pulp_last_updated },
        { label: t`Retained version count`, value: item?.retain_repo_versions ?? t`All` },
        { label: t`Retained package versions`, value: item?.retain_package_versions ?? t`All` },
        {
          label: t`Repository URL`,
          value: item?.distroBasePath ? (
            <CopyURL url={getRepoURL(item.distroBasePath)} />
          ) : (
            '---'
          ),
        },
        { label: t`Autopublish`, value: item?.autopublish ? t`Yes` : t`No` },
        { label: t`Metadata signing service`, value: item?.metadata_signing_service || t`None` },
        { label: t`Package signing service`, value: item?.package_signing_service || t`None` },
        { label: t`Package signing fingerprint`, value: item?.package_signing_fingerprint || t`None` },
        { label: t`Checksum type`, value: item?.checksum_type || t`Unknown` },
        { label: t`Compression type`, value: item?.compression_type || t`None` },
        { label: t`Repo config`, value: JSON.stringify(item?.repo_config) },
        { label: t`Layout`, value: item?.layout },
        {
          label: t`Labels`,
          value: <PulpLabels labels={item?.pulp_labels} />,
        },
        {
          label: t`Remote`,
          value: item?.remote ? (
            <Link
              to={formatPath(Paths.rpm.remote.detail, {
                name: item?.remote.name,
              })}
            >
              {item?.remote.name}
            </Link>
          ) : (
            t`None`
          ),
        },
      ]}
    />
  );
};
