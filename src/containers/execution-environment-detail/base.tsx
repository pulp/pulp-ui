import { Trans, t } from '@lingui/macro';
import { Button } from '@patternfly/react-core';
import { DropdownItem } from '@patternfly/react-core/deprecated';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import {
  type ContainerRepositoryType,
  ExecutionEnvironmentAPI,
  ExecutionEnvironmentRemoteAPI,
} from 'src/api';
import { AppContext, type IAppContextType } from 'src/app-context';
import {
  AlertList,
  type AlertType,
  ContainerRepositoryForm,
  DeleteExecutionEnvironmentModal,
  ExecutionEnvironmentHeader,
  LoadingPage,
  Main,
  NotFound,
  StatefulDropdown,
  closeAlert,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  ParamHelper,
  RepoSigningUtils,
  type RouteProps,
  canSignEE,
  taskAlert,
  waitForTask,
} from 'src/utilities';

interface IState {
  alerts: AlertType[];
  editing: boolean;
  loading: boolean;
  notFound: boolean;
  redirect: string;
  repo: ContainerRepositoryType;
  showDeleteModal: boolean;
}

export interface IDetailSharedProps extends RouteProps {
  containerRepository: ContainerRepositoryType;
  addAlert: (alert: AlertType) => void;
  setNotFound: (value: boolean) => void;
}

// opposite of formatEEPath - converts routeParams from {namespace, container} to "namespace/container"
export const containerName = ({
  namespace,
  container,
}: Record<string, string>): string =>
  [namespace, container].filter(Boolean).join('/');

// A higher order component to wrap individual detail pages
export function withContainerRepo(WrappedComponent) {
  return class extends Component<RouteProps, IState> {
    static contextType = AppContext;
    static displayName = `withContainerRepo(${
      WrappedComponent.displayName || WrappedComponent.name
    })`;

    constructor(props) {
      super(props);

      this.state = {
        alerts: [],
        editing: false,
        loading: true,
        notFound: false,
        redirect: undefined,
        repo: undefined,
        showDeleteModal: false,
      };
    }

    componentDidMount() {
      this.loadRepo();
    }

    componentDidUpdate() {
      // when reloading the same tab, state doesn't reset
      if (this.state.redirect) {
        this.setState({ redirect: null });
      }
    }

    render() {
      const { alerts, editing, loading, notFound, repo, showDeleteModal } =
        this.state;

      const redirect = {
        list: formatPath(Paths.container.repository.list),
      }[this.state.redirect];

      if (redirect) {
        return <Navigate to={redirect} />;
      }

      if (notFound) {
        return <NotFound />;
      }

      if (loading) {
        return <LoadingPage />;
      }

      const permissions = repo.namespace.my_permissions;
      const showEdit =
        permissions.includes(
          'container.namespace_change_containerdistribution',
        ) || permissions.includes('container.change_containernamespace');
      const canSync = permissions.includes(
        'container.change_containernamespace',
      );
      const { hasPermission } = this.context as IAppContextType;
      const dropdownItems = [
        repo.pulp.repository.remote && canSync && (
          <DropdownItem
            key='sync'
            onClick={() => this.sync(repo.name)}
            isDisabled={['running', 'waiting'].includes(
              repo.pulp.repository.remote?.last_sync_task?.state,
            )}
          >
            {t`Sync from registry`}
          </DropdownItem>
        ),
        hasPermission('container.delete_containerrepository') && (
          <DropdownItem
            key='delete'
            onClick={() => {
              this.setState({ showDeleteModal: true });
            }}
          >
            {t`Delete`}
          </DropdownItem>
        ),
        repo && canSignEE(this.context as IAppContextType, repo) && (
          <DropdownItem
            key='sign'
            onClick={() => {
              this.sign();
            }}
          >
            {t`Sign`}
          </DropdownItem>
        ),
      ].filter((truthy) => truthy);

      // move to Owner tab when it can have its own breadcrumbs
      const { group: groupId } = ParamHelper.parseParamString(
        this.props.location.search,
      ) as { group?: number };

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
          {showDeleteModal && (
            <DeleteExecutionEnvironmentModal
              selectedItem={repo.name}
              closeAction={() => this.setState({ showDeleteModal: false })}
              afterDelete={() => {
                (this.context as IAppContextType).setAlerts(alerts);
                this.setState({ redirect: 'list' });
              }}
              addAlert={(text, variant, description = undefined) =>
                this.addAlert(text, variant, description)
              }
            />
          )}
          <ExecutionEnvironmentHeader
            tab={this.getTab()}
            groupId={groupId}
            container={repo}
            displaySignatures={
              (this.context as IAppContextType).featureFlags.container_signing
            }
            pageControls={
              <div style={{ display: 'flex' }}>
                {showEdit ? (
                  <Button
                    onClick={() => this.setState({ editing: true })}
                    variant={'secondary'}
                    data-cy='edit-container'
                  >
                    {t`Edit`}
                  </Button>
                ) : null}
                <StatefulDropdown items={dropdownItems} />
              </div>
            }
          />
          <Main>
            {editing && (
              <ContainerRepositoryForm
                name={repo.name}
                namespace={repo.namespace.name}
                description={repo.description}
                permissions={permissions}
                onSave={(promise) => {
                  promise.then((results) => {
                    const task = results.find((x) => x.data && x.data.task);
                    this.setState({
                      editing: false,
                      loading: true,
                      alerts: alerts.concat({
                        variant: 'success',
                        title: (
                          <Trans>
                            Saved changes to container &quot;
                            {repo.name}&quot;.
                          </Trans>
                        ),
                      }),
                    });
                    if (task) {
                      waitForTask(
                        task.data.task.split('tasks/')[1].replace('/', ''),
                      ).then(() => {
                        this.loadRepo();
                      });
                    } else {
                      this.loadRepo();
                    }
                  });
                }}
                onCancel={() => this.setState({ editing: false })}
                distributionPulpId={repo.pulp.distribution.id}
                isRemote={!!repo.pulp.repository.remote}
                upstreamName={repo.pulp.repository.remote?.upstream_name}
                registry={repo.pulp.repository.remote?.registry}
                excludeTags={repo.pulp.repository.remote?.exclude_tags || []}
                includeTags={repo.pulp.repository.remote?.include_tags || []}
                remoteId={repo.pulp.repository.remote?.id}
              />
            )}
            <WrappedComponent
              containerRepository={repo}
              editing={editing}
              addAlert={({ title, variant, description = null }) =>
                this.addAlert(title, variant, description)
              }
              setNotFound={(notFound) => this.setState({ notFound })}
              {...this.props}
            />
          </Main>
        </>
      );
    }

    private loadRepo() {
      const container = containerName(this.props.routeParams);
      ExecutionEnvironmentAPI.get(container)
        .then((result) => {
          this.setState({
            repo: result.data,
            loading: false,
          });

          const last_sync_task =
            result.data.pulp.repository.remote?.last_sync_task || {};
          if (
            last_sync_task.state &&
            ['running', 'waiting'].includes(last_sync_task.state)
          ) {
            // keep refreshing while a remove repo is being synced
            setTimeout(() => this.loadRepo(), 10000);
          }
        })
        .catch(() => this.setState({ notFound: true }));
    }

    private getTab() {
      const tabs = ['detail', 'images', 'activity', 'access'];
      const location = this.props.location.pathname.split('/');
      const index = location.findIndex((s) => s === '_content');

      // match /containers/access/_content/access but not /containers/access
      // also handles /containers/:name/_content/images/:digest
      if (index !== -1) {
        const loc = location[index + 1];
        for (const tab of tabs) {
          if (loc === tab) {
            return tab;
          }
        }
      }

      return 'detail';
    }

    private addAlert(title, variant, description?) {
      this.addAlertObj({
        description,
        title,
        variant,
      });
    }

    private addAlertObj(alert: AlertType) {
      this.setState({
        alerts: [...this.state.alerts, alert],
      });
    }

    private sync(name) {
      ExecutionEnvironmentRemoteAPI.sync(name)
        .then(({ data }) => {
          this.addAlertObj(
            taskAlert(
              data.task,
              t`Sync started for remote registry "${name}".`,
            ),
          );
          this.loadRepo();
        })
        .catch(() => this.addAlert(t`Sync failed for ${name}`, 'danger'));
    }

    private sign() {
      RepoSigningUtils.sign(
        this.state.repo,
        this.context as IAppContextType,
        (alert) => this.addAlertObj(alert),
        () => this.loadRepo(),
      );
    }
  };
}
