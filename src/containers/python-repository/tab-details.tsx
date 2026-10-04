import { t } from '@lingui/core/macro';
import { Link } from 'react-router';
import { type PythonRemoteType, type PythonRepositoryType } from 'src/api';
import { Details, PulpLabels } from 'src/components';
import { Paths, formatPath } from 'src/paths';

interface TabProps {
  item: PythonRepositoryType & {
    distroBasePath?: string;
    remote?: PythonRemoteType;
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
          label: t`Labels`,
          value: <PulpLabels labels={item?.pulp_labels} />,
        },
        {
          label: t`Remote`,
          value: item?.remote ? (
            <Link
              to={formatPath(Paths.python.remote.detail, {
                name: item?.remote.name,
              })}
            >
              {item?.remote.name}
            </Link>
          ) : (
            t`None`
          ),
        },
        {
          label: t`Package substitution`,
          value:
            item?.allow_package_substitution === false
              ? t`Not allowed`
              : t`Allowed`,
        },
        {
          label: t`When packages are rejected`,
          value:
            item?.error_on_reject === false
              ? t`Skip them`
              : t`Fail the whole version`,
        },
      ]}
    />
  );
};
