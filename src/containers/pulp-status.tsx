import { t } from '@lingui/core/macro';
import {
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
  Gallery,
  GalleryItem,
  Progress,
} from '@patternfly/react-core';
import { sortBy } from 'lodash';
import { Component, type ReactNode, useState } from 'react';
import { PulpStatusAPI } from 'src/api';
import {
  AlertList,
  type AlertType,
  BaseHeader,
  DateComponent,
  LoadingSpinner,
  Main,
  closeAlert,
} from 'src/components';
import {
  type RouteProps,
  getHumanSize,
  jsxErrorMessage,
  withRouter,
} from 'src/utilities';

interface IState {
  alerts: AlertType[];
  status?;
}

const AsJSON = ({ data }: { data }) => (
  <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
);

const StatusVersions = ({
  versions,
}: {
  versions: { component; version }[];
}) => {
  const sorted = sortBy(versions, 'component');

  return (
    <table style={{ width: '100%' }}>
      <tbody>
        {sorted.map(({ component, version }) => (
          <tr key={component}>
            <td>{component}</td>
            <td>{version}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const StatusOnlineWorkers = ({
  onlineWorkers,
}: {
  onlineWorkers: {
    current_task;
    last_heartbeat;
    name;
    pulp_created;
    pulp_last_updated;
  }[];
}) => (
  <>
    {onlineWorkers.map(
      (
        { current_task, last_heartbeat, name, pulp_created, pulp_last_updated },
        i,
      ) => (
        <div key={name} style={{ paddingTop: i ? '8px' : '0' }}>
          <strong>{t`Name`}</strong>: {name}
          <br />
          <strong>{t`Created`}</strong>: <DateComponent date={pulp_created} />
          <br />
          <strong>{t`Last updated`}</strong>:{' '}
          <DateComponent date={pulp_last_updated} />
          <br />
          <strong>{t`Last heartbeat`}</strong>:{' '}
          <DateComponent date={last_heartbeat} />
          <br />
          {/* TODO: link to tasks, show name */}
          <strong>{t`Current task`}</strong>:{' '}
          {current_task ? <AsJSON data={current_task} /> : t`None`}
        </div>
      ),
    )}
  </>
);

const StatusOnlineApps = ({ apps }: { apps: { name; last_heartbeat }[] }) => (
  <>
    {apps.map(({ name, last_heartbeat }, i) => (
      <div key={name} style={{ paddingTop: i ? '8px' : '0' }}>
        <strong>{t`Name`}</strong>: {name}
        <br />
        <strong>{t`Last heartbeat`}</strong>:{' '}
        <DateComponent date={last_heartbeat} />
      </div>
    ))}
  </>
);

const StatusOnlineApiApps = ({
  onlineApiApps,
}: {
  onlineApiApps: { name; last_heartbeat }[];
}) => <StatusOnlineApps apps={onlineApiApps} />;

const StatusOnlineContentApps = ({
  onlineContentApps,
}: {
  onlineContentApps: { name; last_heartbeat }[];
}) => <StatusOnlineApps apps={onlineContentApps} />;

const StatusDatabaseConnection = ({
  databaseConnection,
}: {
  databaseConnection: { connected: boolean };
}) => (databaseConnection?.connected ? t`Connected` : `Not connected`);

const StatusRedisConnection = ({
  redisConnection,
}: {
  redisConnection: { connected: boolean };
}) => (redisConnection?.connected ? t`Connected` : `Not connected`);

const StatusStorage = ({ storage }: { storage: { total; used; free } }) => {
  const value = (100 / storage.total) * storage.used;
  const total = getHumanSize(storage.total);
  const used = getHumanSize(storage.used);
  const free = getHumanSize(storage.free);

  return (
    <>
      <Progress
        value={value}
        title={t`Storage`}
        variant={
          value > 88
            ? 'danger'
            : value > 66
              ? 'warning'
              : value > 33
                ? null
                : 'success'
        }
      />
      <br />
      <strong>{t`Total`}</strong>: {total}
      <br />
      <strong>{t`Used`}</strong>: {used}
      <br />
      <strong>{t`Free`}</strong>: {free}
    </>
  );
};

const StatusContentSettings = ({
  contentSettings,
}: {
  contentSettings: { content_origin; content_path_prefix };
}) => (
  <>
    <p>
      <strong>{t`Origin`}</strong>:{' '}
      <code>{contentSettings.content_origin}</code>
    </p>
    <p>
      <strong>{t`Path prefix`}</strong>:{' '}
      <code>{contentSettings.content_path_prefix}</code>
    </p>
  </>
);

const StatusDomainEnabled = ({ domainEnabled }: { domainEnabled: boolean }) =>
  domainEnabled ? t`Enabled` : t`Not enabled`;

const CardItem = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <GalleryItem>
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardBody>{children}</CardBody>
    </Card>
  </GalleryItem>
);

const CardJSON = ({ status }: { status }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Card isExpanded={expanded}>
      <CardHeader onExpand={() => setExpanded(!expanded)}>
        <CardTitle onClick={() => setExpanded(!expanded)}>{t`JSON`}</CardTitle>
      </CardHeader>
      <CardExpandableContent>
        <CardBody>
          <AsJSON data={status} />
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};

class PulpStatus extends Component<RouteProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      alerts: [],
      status: null,
    };
  }

  componentDidMount() {
    this.query();
  }

  render() {
    const { alerts, status } = this.state;

    return (
      <>
        <AlertList
          alerts={alerts}
          closeAlert={(i) =>
            closeAlert(i, {
              alerts,
              setAlerts: (alerts) => this.setState({ alerts }),
            })
          }
        />
        <BaseHeader title={t`Status`} />
        {!status ? (
          <Main>
            <LoadingSpinner />
          </Main>
        ) : (
          <Main>
            <Gallery hasGutter>
              <CardItem title={t`Versions`}>
                <StatusVersions versions={status?.versions} />
              </CardItem>
              <CardItem title={t`Storage`}>
                <StatusStorage storage={status?.storage} />
              </CardItem>
              <CardItem title={t`Content settings`}>
                <StatusContentSettings
                  contentSettings={status?.content_settings}
                />
              </CardItem>
              <CardItem title={t`Database connection`}>
                <StatusDatabaseConnection
                  databaseConnection={status?.database_connection}
                />
              </CardItem>
              <CardItem title={t`Redis connection`}>
                <StatusRedisConnection
                  redisConnection={status?.redis_connection}
                />
              </CardItem>
              <CardItem title={t`Domain enabled`}>
                <StatusDomainEnabled domainEnabled={status?.domain_enabled} />
              </CardItem>
              <CardItem title={t`Online workers`}>
                <StatusOnlineWorkers onlineWorkers={status?.online_workers} />
              </CardItem>
              <CardItem title={t`Online api apps`}>
                <StatusOnlineApiApps onlineApiApps={status?.online_api_apps} />
              </CardItem>
              <CardItem title={t`Online content apps`}>
                <StatusOnlineContentApps
                  onlineContentApps={status?.online_content_apps}
                />
              </CardItem>
            </Gallery>
            <br />
            <CardJSON status={status} />{' '}
          </Main>
        )}
      </>
    );
  }

  private query() {
    PulpStatusAPI.get()
      .then(({ data }) => {
        this.setState({ status: data });
      })
      .catch((e) => {
        const { status, statusText } = e.response;
        this.setState({
          alerts: [
            ...this.state.alerts,
            {
              variant: 'danger',
              title: t`Failed to load status`,
              description: jsxErrorMessage(status, statusText),
            },
          ],
        });
      });
  }
}

export default withRouter(PulpStatus);
