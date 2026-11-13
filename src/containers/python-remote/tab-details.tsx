import { t } from '@lingui/core/macro';
import { type PythonRemoteType } from 'src/api';
import {
  CopyURL,
  Details,
  LazyRepositories,
  PulpCodeBlock,
} from 'src/components';

interface TabProps {
  item: PythonRemoteType;
  actionContext: object;
}

const MaybeCode = ({ code, filename }: { code: string; filename: string }) =>
  code ? <PulpCodeBlock code={code} filename={filename} /> : <>{t`None`}</>;

export const DetailsTab = ({ item }: TabProps) => (
  <Details
    fields={[
      { label: t`Remote name`, value: item?.name },
      {
        label: t`URL`,
        value: <CopyURL url={item?.url} fallback />,
      },
      { label: t`Download policy`, value: item?.policy },
      {
        label: t`Includes`,
        value: item?.includes?.length
          ? item.includes.join(', ')
          : t`All projects`,
      },
      {
        label: t`Excludes`,
        value: item?.excludes?.length ? item.excludes.join(', ') : t`None`,
      },
      {
        label: t`Pre-releases`,
        value: item?.prereleases ? t`Included` : t`Excluded`,
      },
      {
        label: t`Package types`,
        value: item?.package_types?.length
          ? item.package_types.join(', ')
          : t`All`,
      },
      {
        label: t`Latest versions kept per package`,
        value: item?.keep_latest_packages || t`All`,
      },
      {
        label: t`Excluded platforms`,
        value: item?.exclude_platforms?.length
          ? item.exclude_platforms.join(', ')
          : t`None`,
      },
      {
        label: t`Provenance`,
        value: item?.provenance ? t`Synced` : t`Not synced`,
      },
      {
        label: t`Proxy URL`,
        value: <CopyURL url={item?.proxy_url} fallback />,
      },
      {
        label: t`TLS validation`,
        value: item?.tls_validation ? t`Enabled` : t`Disabled`,
      },
      {
        label: t`Client certificate`,
        value: (
          <MaybeCode
            code={item?.client_cert}
            filename={item.name + '-client_cert'}
          />
        ),
      },
      {
        label: t`CA certificate`,
        value: (
          <MaybeCode code={item?.ca_cert} filename={item.name + '-ca_cert'} />
        ),
      },
      {
        label: t`Download concurrency`,
        value: item?.download_concurrency ?? t`None`,
      },
      { label: t`Rate limit`, value: item?.rate_limit ?? t`None` },
      {
        label: t`Repositories`,
        value: (
          <LazyRepositories plugin='python' remote_href={item?.pulp_href} />
        ),
      },
    ]}
  />
);
