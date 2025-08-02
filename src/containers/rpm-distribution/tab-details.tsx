import { t } from '@lingui/core/macro';
import { type RPMDistributionType } from 'src/api';
import {
  CopyURL,
  Details,
  LazyRepositories,
  PulpCodeBlock,
} from 'src/components';

interface TabProps {
  item: RPMDistributionType;
  actionContext: object;
}

const MaybeCode = ({ code, rpmname }: { code: string; rpmname: string }) =>
  code ? <PulpCodeBlock code={code} filename={rpmname} /> : <>{t`None`}</>;

export const DetailsTab = ({ item }: TabProps) => (
  <Details
    fields={[
      { label: t`Distribution name`, value: item?.name },
      {
        label: t`Base path`,
        value: <CopyURL url={item?.base_path} fallback />,
      },
      {
        label: t`Content guard`,
        value: <CopyURL url={item?.content_guard} fallback />,
      },
      {
        label: t`hidden`,
        value: item?.hidden ? t`Yes` : t`No`,
      },
      {
        label: t`Labels`,
        value: item?.pulp_labels
          ? Object.entries(item.pulp_labels).map(([key, value]) => (
              <div key={key}>
                {key}: {value}
              </div>
            ))
          : t`None`,
      },
      {
        label: t`Repository`,
        value: <CopyURL url={item?.repository} fallback />,
      },
      {
        label: t`Publication`,
        value: <CopyURL url={item?.publication} fallback />,
      },
      {
        label: t`Generate repo config`,
        value: item?.generate_repo_config ? t`Yes` : t`No`,
      },
      {
        label: t`Checkpoint`,
        value: item?.checkpoint ? t`Yes` : t`No`,
      },
    ]}
  />
);
