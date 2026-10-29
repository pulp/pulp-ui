import { t } from '@lingui/core/macro';
import { Component } from 'react';
import {
  ContainerDistributionAPI,
  ContainerRemoteNativeAPI,
  ContainerRepositoryNativeAPI,
  type ContainerRepositoryNativeType,
  type ContainerRemoteNativeType,
} from 'src/api';
import { AppContext, type IAppContextType } from 'src/app-context';
import {
  AlertList,
  type AlertType,
  BaseHeader,
  Breadcrumbs,
  LinkTabs,
  LoadingSpinner,
  Main,
  NotFound,
  closeAlert,
} from 'src/components';
import { Paths, formatEEPath, formatPath } from 'src/paths';
import {
  ParamHelper,
  parsePulpIDFromURL,
  type RouteProps,
  withRouter,
} from 'src/utilities';
import { DetailsTab } from './tab-details';
import { DistributionsTab } from './tab-distributions';
import { RepositoryVersionsTab } from './tab-repository-versions';

interface ContainerDistributionType {
  pulp_href: string;
  pulp_created: string;
  pulp_last_updated: string;
  name: string;
  description: string | null;
  base_path: string;
  registry_path: string;
  repository: string | null;
  remote: string | null;
}

export interface ContainerDetailItem
  extends Omit<ContainerDistributionType, 'repository' | 'remote'> {
  repositoryHref?: string | null;
  remoteHref?: string | null;
  repository?: ContainerRepositoryNativeType | null;
  remote?: ContainerRemoteNativeType | null;
}

export interface ContainerDetailTabProps {
  item: ContainerDetailItem;
  actionContext: {
    addAlert: (alert: AlertType) => void;
    state: { params: Record<string, string> };
    hasPermission: (permission: string) => boolean;
    hasObjectPermission: (permission: string) => boolean;
  };
}

interface IState {
  alerts: AlertType[];
  item: ContainerDetailItem | null;
  loading: boolean;
  notFound: boolean;
  params: Record<string, string>;
}

const containerName = ({
  namespace,
  container,
}: Record<string, string>): string =>
  [namespace, container].filter(Boolean).join('/');

class ExecutionEnvironmentDetail extends Component<RouteProps, IState> {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    const params = ParamHelper.parseParamString(props.location.search) as Record<
      string,
      string
    >;

    if (!params.tab) {
      params.tab = 'details';
    }

    this.state = {
      alerts: [],
      item: null,
      loading: true,
      notFound: false,
      params,
    };
  }

  componentDidMount() {
    this.setState({ alerts: (this.context as IAppContextType).alerts || [] });
    (this.context as IAppContextType).setAlerts([]);

    this.load();
  }

  componentDidUpdate(prevProps) {
    const oldContainer = containerName(prevProps.routeParams);
    const newContainer = containerName(this.props.routeParams);

    if (oldContainer !== newContainer) {
      this.load();
      return;
    }

    if (prevProps.location.search !== this.props.location.search) {
      const params = ParamHelper.parseParamString(
        this.props.location.search,
      ) as Record<string, string>;
      this.setState({ params: { tab: 'details', ...params } });
    }
  }

  render() {
    const { alerts, item, loading, notFound, params } = this.state;

    if (notFound) {
      return (
        <>
          <AlertList
            alerts={alerts}
            closeAlert={(index) =>
              closeAlert(index, {
                alerts,
                setAlerts: (next) => this.setState({ alerts: next }),
              })
            }
          />
          <NotFound />
        </>
      );
    }

    const tab = params.tab || 'details';
    const title = item?.name || containerName(this.props.routeParams);

    return (
      <>
        <AlertList
          alerts={alerts}
          closeAlert={(index) =>
            closeAlert(index, {
              alerts,
              setAlerts: (next) => this.setState({ alerts: next }),
            })
          }
        />
        <BaseHeader
          title={title}
          breadcrumbs={
            <Breadcrumbs
              links={this.breadcrumbs(item, tab, this.state.params)}
            />
          }
        >
          {item && (
            <div className='pulp-tab-link-container'>
              <div className='tabs'>{this.renderTabs(tab, item)}</div>
            </div>
          )}
        </BaseHeader>
        <Main>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <section className='pulp-section'>
              {item && this.renderTab(tab, item)}
            </section>
          )}
        </Main>
      </>
    );
  }

  private breadcrumbs(item: ContainerDetailItem | null, tab: string, params) {
    const basePath = item?.base_path || containerName(this.props.routeParams);

    return [
      { url: formatPath(Paths.container.repository.list), name: t`Containers` },
      {
        url: formatEEPath(Paths.container.repository.detail, {
          container: basePath,
        }),
        name: item?.name || basePath,
      },
      tab === 'repository-versions' && params.repositoryVersion
        ? {
            url: formatEEPath(
              Paths.container.repository.detail,
              { container: basePath },
              { tab: 'repository-versions' },
            ),
            name: t`Versions`,
          }
        : null,
      tab === 'repository-versions' && params.repositoryVersion
        ? { name: t`Version ${params.repositoryVersion}` }
        : null,
      tab === 'repository-versions' && !params.repositoryVersion
        ? { name: t`Versions` }
        : null,
      tab === 'distributions' ? { name: t`Distributions` } : null,
      tab === 'details' ? { name: t`Details` } : null,
    ].filter(Boolean);
  }

  private renderTabs(tab: string, item: ContainerDetailItem) {
    return (
      <LinkTabs
        tabs={[
          {
            active: tab === 'details',
            title: t`Details`,
            link: formatEEPath(
              Paths.container.repository.detail,
              { container: item.base_path },
              { tab: 'details' },
            ),
          },
          {
            active: tab === 'repository-versions',
            title: t`Versions`,
            link: formatEEPath(
              Paths.container.repository.detail,
              { container: item.base_path },
              { tab: 'repository-versions' },
            ),
          },
          {
            active: tab === 'distributions',
            title: t`Distributions`,
            link: formatEEPath(
              Paths.container.repository.detail,
              { container: item.base_path },
              { tab: 'distributions' },
            ),
          },
        ]}
      />
    );
  }

  private renderTab(tab: string, item: ContainerDetailItem) {
    const actionContext = {
      addAlert: (alert: AlertType) => this.addAlert(alert),
      state: { params: this.state.params },
      hasPermission: (this.context as IAppContextType).hasPermission,
      hasObjectPermission: (_permission: string) => true,
    };

    return (
      {
        details: <DetailsTab item={item} actionContext={actionContext} />,
        'repository-versions': (
          <RepositoryVersionsTab item={item} actionContext={actionContext} />
        ),
        distributions: (
          <DistributionsTab item={item} actionContext={actionContext} />
        ),
      }[tab] || <DetailsTab item={item} actionContext={actionContext} />
    );
  }

  private load() {
    const basePath = containerName(this.props.routeParams);

    this.setState({ loading: true, notFound: false }, () => {
      ContainerDistributionAPI.list({ base_path: basePath, page_size: 1 })
        .then(({ data }) => {
          const distribution = data?.results?.[0] as ContainerDistributionType;

          if (!distribution) {
            throw new Error('not-found');
          }

          const repositoryPromise = distribution.repository
            ? ContainerRepositoryNativeAPI.getByHref(distribution.repository)
                .then((result) => result.data as ContainerRepositoryNativeType)
                .catch(() => null)
            : Promise.resolve(null);

          return Promise.all([Promise.resolve(distribution), repositoryPromise]);
        })
        .then(([distribution, repository]) => {
          const remoteHref = repository?.remote || distribution.remote;
          const remotePromise = remoteHref
            ? ContainerRemoteNativeAPI.get(parsePulpIDFromURL(remoteHref))
                .then((result) => result.data as ContainerRemoteNativeType)
                .catch(() => null)
            : Promise.resolve(null);

          return Promise.all([
            Promise.resolve(distribution),
            Promise.resolve(repository),
            remotePromise,
          ]);
        })
        .then(([distribution, repository, remote]) => {
          this.setState({
            item: {
              ...distribution,
              repositoryHref: distribution.repository,
              remoteHref: distribution.remote,
              repository,
              remote,
              name: repository?.name || distribution.name || distribution.base_path,
              description: repository?.description || distribution.description,
            },
            loading: false,
            notFound: false,
          });
        })
        .catch(() => {
          this.setState({ loading: false, notFound: true, item: null });
        });
    });
  }

  private addAlert(alert: AlertType) {
    this.setState({ alerts: [...this.state.alerts, alert] });
  }
}

export default withRouter(ExecutionEnvironmentDetail);
