import { t } from '@lingui/core/macro';
import { Link } from 'react-router';
import { DateComponent, Details, PulpLabels } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { type ContainerDetailTabProps } from './execution-environment-detail-native';

export const DetailsTab = ({ item }: ContainerDetailTabProps) => {
  const remote = item.remote;

  return (
    <Details
      fields={[
        { label: t`Repo name`, value: item.repository?.name || item.name },
        { label: t`Description`, value: item.repository?.description || t`None` },
        { label: t`Base path`, value: item.base_path },
        { label: t`Registry path`, value: item.registry_path || t`None` },
        {
          label: t`Created`,
          value: <DateComponent date={item.repository?.pulp_created || item.pulp_created} />,
        },
        {
          label: t`Last modified`,
          value: (
            <DateComponent
              date={item.repository?.pulp_last_updated || item.pulp_last_updated}
            />
          ),
        },
        {
          label: t`Labels`,
          value: <PulpLabels labels={item.repository?.pulp_labels || {}} />,
        },
        {
          label: t`Remotes`,
          value: remote ? (
            <Link
              to={formatPath(
                Paths.container.remote.list,
                {},
                { name__icontains: remote.name },
              )}
            >
              {remote.name}
            </Link>
          ) : (
            t`None`
          ),
        },
        {
          label: t`Remote URL`,
          value: remote?.url || t`None`,
        },
      ]}
    />
  );
};
