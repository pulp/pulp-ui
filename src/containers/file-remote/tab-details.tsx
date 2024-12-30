import { t } from '@lingui/core/macro';
import { type FileRemoteType } from 'src/api';
import {
  CopyURL,
  Details,
  LazyRepositories,
  PulpCodeBlock,
} from 'src/components';

interface TabProps {
  item: FileRemoteType;
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
        value: <LazyRepositories plugin='file' remote_href={item?.pulp_href} />,
      },
      {
        label: t`YAML requirements`,
        value: (
          <MaybeCode
            code={item?.requirements_file}
            filename={item.name + '-requirements.yml'}
          />
        ),
      },
    ]}
  />
);
