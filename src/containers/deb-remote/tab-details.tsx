import { t } from '@lingui/core/macro';
import { type DebRemoteType } from 'src/api';
import {
  CopyURL,
  Details,
  LazyRepositories,
  PulpCodeBlock,
} from 'src/components';

interface TabProps {
  item: DebRemoteType;
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
      // The APT-specific fields. `distributions` is required by the API, the
      // other two default to every component / architecture the release offers.
      { label: t`Distributions`, value: item?.distributions || t`None` },
      { label: t`Components`, value: item?.components || t`All` },
      { label: t`Architectures`, value: item?.architectures || t`All` },
      {
        label: t`Sync sources`,
        value: item?.sync_sources ? t`Enabled` : t`Disabled`,
      },
      {
        label: t`Sync installer packages`,
        value: item?.sync_udebs ? t`Enabled` : t`Disabled`,
      },
      {
        label: t`Sync installer files`,
        value: item?.sync_installer ? t`Enabled` : t`Disabled`,
      },
      {
        label: t`GPG key`,
        value: (
          <MaybeCode code={item?.gpgkey} filename={item.name + '-gpgkey'} />
        ),
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
        value: <LazyRepositories plugin='deb' remote_href={item?.pulp_href} />,
      },
    ]}
  />
);
