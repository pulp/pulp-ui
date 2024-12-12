import { t } from '@lingui/core/macro';
import { Link } from 'react-router';
import { type AnsibleRemoteType, type AnsibleRepositoryType } from 'src/api';
import { CopyURL, Details, PulpLabels } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { getDistroURL } from 'src/utilities';

interface TabProps {
  item: AnsibleRepositoryType & {
    distribution?;
    remote?: AnsibleRemoteType;
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
          value: item?.distribution ? (
            <CopyURL url={getDistroURL(item.distribution)} />
          ) : (
            '---'
          ),
        },
        {
          label: t`Labels`,
          value: <PulpLabels labels={item?.pulp_labels} />,
        },
        {
          label: t`Private`,
          value: item?.private ? t`Yes` : t`No`,
        },
        {
          label: t`Remote`,
          value: item?.remote ? (
            <Link
              to={formatPath(Paths.ansible.remote.detail, {
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
