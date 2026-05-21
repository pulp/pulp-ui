import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';
import { Component } from 'react';
import {
  ContainerRemoteNativeAPI,
  ExecutionEnvironmentRegistryAPI,
  type ContainerRemoteNativeType,
  type RemoteType,
} from 'src/api';
import { AppContext, type IAppContextType } from 'src/app-context';
import {
  AlertList,
  type AlertType,
  AppliedFilters,
  BaseHeader,
  CompoundFilter,
  CopyURL,
  DateComponent,
  DeleteModal,
  EmptyStateFilter,
  EmptyStateNoData,
  ListItemActions,
  LoadingSpinner,
  Main,
  PulpPagination,
  RemoteForm,
  SortTable,
  closeAlert,
} from 'src/components';
import {
  type ErrorMessagesType,
  ParamHelper,
  type RouteProps,
  filterIsSet,
  jsxErrorMessage,
  mapErrorMessages,
  taskAlert,
  withRouter,
} from 'src/utilities';

interface IState {
  alerts: AlertType[];
  itemCount: number;
  items: ContainerRemoteNativeType[];
  loading: boolean;
  params: {
    page?: number;
    page_size?: number;
  };
  remoteFormErrors: ErrorMessagesType;
  remoteFormNew: boolean;
  remoteToEdit?: RemoteType;
  remoteUnmodified?: RemoteType;
  showDeleteModal: boolean;
  showRemoteFormModal: boolean;
  inputText: string;
}

class ExecutionEnvironmentRegistryList extends Component<RouteProps, IState> {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    const params = ParamHelper.parseParamString(props.location.search, [
      'page',
      'page_size',
    ]);

    if (!params['page_size']) {
      params['page_size'] = 10;
    }

    if (!params['sort']) {
      params['sort'] = 'name';
    }

    this.state = {
      alerts: [],
      itemCount: 0,
      items: [],
      loading: true,
      params,
      remoteFormErrors: {},
      remoteFormNew: false,
      remoteToEdit: null,
      remoteUnmodified: null,
      showDeleteModal: false,
      showRemoteFormModal: false,
      inputText: '',
    };
  }

  componentDidMount() {
    this.queryRegistries();
  }

  render() {
    const {
      alerts,
      itemCount,
      items,
      loading,
      params,
      remoteFormErrors,
      remoteFormNew,
      remoteToEdit,
      remoteUnmodified,
      showDeleteModal,
      showRemoteFormModal,
    } = this.state;
    const noData =
      items.length === 0 && !filterIsSet(params, ['name__icontains']);

    const { hasPermission } = this.context as IAppContextType;
    const addButton = hasPermission('galaxy.add_containerregistryremote') ? (
      <Button
        onClick={() =>
          this.setState({
            remoteFormErrors: {},
            remoteFormNew: true,
            remoteToEdit: {
              name: '',
              // API defaults to true when not sending anything, make the UI fit
              tls_validation: true,
              hidden_fields: [
                { name: 'username', is_set: false },
                { name: 'password', is_set: false },
                { name: 'proxy_username', is_set: false },
                { name: 'proxy_password', is_set: false },
                { name: 'client_key', is_set: false },
              ],
            } as RemoteType,
            remoteUnmodified: null,
            showRemoteFormModal: true,
          })
        }
      >
        {t`Add remote registry`}
      </Button>
    ) : null;

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
        {showRemoteFormModal && (
          <RemoteForm
            allowEditName={remoteFormNew}
            closeModal={() =>
              this.setState({
                remoteToEdit: null,
                remoteUnmodified: null,
                showRemoteFormModal: false,
              })
            }
            errorMessages={remoteFormErrors}
            plugin='container'
            remote={remoteToEdit}
            saveRemote={() => {
              const { remoteFormNew, remoteToEdit } = this.state;
              const newRemote = { ...remoteToEdit };

              if (remoteFormNew) {
                // prevent "This field may not be blank." when writing in and then deleting username/password/etc
                // only when creating, edit diffs with remoteUnmodified
                Object.keys(newRemote).forEach((k) => {
                  if (newRemote[k] === '' || newRemote[k] == null) {
                    delete newRemote[k];
                  }
                });
              }

              const promise = remoteFormNew
                ? ExecutionEnvironmentRegistryAPI.create(newRemote)
                : ExecutionEnvironmentRegistryAPI.smartUpdate(
                    remoteToEdit.id,
                    remoteToEdit,
                    remoteUnmodified,
                  );

              promise
                .then(() => {
                  this.setState(
                    {
                      remoteToEdit: null,
                      remoteUnmodified: null,
                      showRemoteFormModal: false,
                    },
                    () => this.queryRegistries(),
                  );
                })
                .catch((err) =>
                  this.setState({ remoteFormErrors: mapErrorMessages(err) }),
                );
            }}
            showModal={showRemoteFormModal}
            title={
              remoteFormNew ? t`Add remote registry` : t`Edit remote registry`
            }
            updateRemote={(r: RemoteType) => this.setState({ remoteToEdit: r })}
          />
        )}
        {showDeleteModal && remoteToEdit && (
          <DeleteModal
            cancelAction={() =>
              this.setState({ showDeleteModal: false, remoteToEdit: null })
            }
            deleteAction={() => this.deleteRegistry(remoteToEdit)}
            title={t`Delete remote registry?`}
          >
            <Trans>
              <b>{remoteToEdit.name}</b> will be deleted.
            </Trans>
          </DeleteModal>
        )}
        <BaseHeader title={t`Remote registries`} />
        {noData && !loading ? (
          <EmptyStateNoData
            title={t`No remote registries yet`}
            description={t`You currently have no remote registries.`}
            button={addButton}
          />
        ) : (
          <Main>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <section className='pulp-section'>
                <div className='pulp-toolbar'>
                  <Toolbar>
                    <ToolbarContent>
                      <ToolbarGroup>
                        <ToolbarItem>
                          <CompoundFilter
                            inputText={this.state.inputText}
                            onChange={(text) =>
                              this.setState({ inputText: text })
                            }
                            updateParams={(p) =>
                              this.updateParams(p, () => this.queryRegistries())
                            }
                            params={params}
                            filterConfig={[
                              {
                                id: 'name__icontains',
                                title: t`Name`,
                              },
                            ]}
                          />
                        </ToolbarItem>
                        <ToolbarItem>{addButton}</ToolbarItem>
                      </ToolbarGroup>
                    </ToolbarContent>
                  </Toolbar>

                  <PulpPagination
                    params={params}
                    updateParams={(p) =>
                      this.updateParams(p, () => this.queryRegistries())
                    }
                    count={itemCount}
                    isTop
                  />
                </div>
                <div>
                  <AppliedFilters
                    updateParams={(p) => {
                      this.updateParams(p, () => this.queryRegistries());
                      this.setState({ inputText: '' });
                    }}
                    params={params}
                    ignoredParams={['page_size', 'page', 'sort']}
                    niceNames={{
                      name__icontains: t`Name`,
                    }}
                  />
                </div>
                {this.renderTable(params)}
                <PulpPagination
                  params={params}
                  updateParams={(p) =>
                    this.updateParams(p, () => this.queryRegistries())
                  }
                  count={itemCount}
                />
              </section>
            )}
          </Main>
        )}
      </>
    );
  }

  private renderTable(params) {
    const { items } = this.state;
    if (items.length === 0) {
      return <EmptyStateFilter />;
    }

    const sortTableOptions = {
      headers: [
        {
          title: t`Name`,
          type: 'alpha',
          id: 'name',
        },
        {
          title: t`Created`,
          type: 'alpha',
          id: 'created_at',
        },
        {
          title: t`Last updated`,
          type: 'alpha',
          id: 'updated_at',
        },
        {
          title: t`Registry URL`,
          type: 'alpha',
          id: 'url',
        },
        {
          title: '',
          type: 'none',
          id: 'controls',
        },
      ],
    };

    return (
      <Table>
        <SortTable
          options={sortTableOptions}
          params={params}
          updateParams={(p) =>
            this.updateParams(p, () => this.queryRegistries())
          }
        />
        <Tbody>{items.map((user, i) => this.renderTableRow(user, i))}</Tbody>
      </Table>
    );
  }

  private renderTableRow(item, index: number) {
    return (
      <Tr
        data-cy={`ExecutionEnvironmentRegistryList-row-${item.name}`}
        key={index}
      >
        <Td>{item.name}</Td>
        <Td>
          <DateComponent date={item.pulp_created} />
        </Td>
        <Td>
          <DateComponent date={item.pulp_last_updated} />
        </Td>
        <Td>
          <CopyURL url={item.url} />
        </Td>
        <ListItemActions kebabItems={[]} buttons={[]} />
      </Tr>
    );
  }

  private queryRegistries(noLoading = false) {
    this.setState(noLoading ? null : { loading: true }, () =>
      ContainerRemoteNativeAPI.list(this.state.params)
        .then((result) => {
          this.setState({
            items: result.data.results,
            itemCount: result.data.count,
            loading: false,
          });
        })
        .catch(() => {
          this.setState({ loading: false });
          this.addAlert(t`Remotes could not be loaded.`, 'danger');
        }),
    );
  }

  private deleteRegistry({ id, name }) {
    ExecutionEnvironmentRegistryAPI.delete(id)
      .then(() =>
        this.addAlert(
          t`Remote registry "${name}" has been successfully deleted.`,
          'success',
        ),
      )
      .catch((err) => {
        const { status, statusText } = err.response;
        this.addAlert(
          t`Remote registry "${name}" could not be deleted.`,
          'danger',
          jsxErrorMessage(status, statusText),
        );
      })
      .then(() => {
        this.queryRegistries();
        this.setState({ showDeleteModal: false, remoteToEdit: null });
      });
  }

  private syncRegistry({ id, name }) {
    ExecutionEnvironmentRegistryAPI.sync(id)
      .then(({ data }) => {
        this.addAlertObj(
          taskAlert(data.task, t`Sync started for remote registry "${name}".`),
        );
        this.queryRegistries(true);
      })
      .catch((err) => {
        const { status, statusText } = err.response;
        this.addAlert(
          t`Remote registry "${name}" could not be synced.`,
          'danger',
          jsxErrorMessage(status, statusText),
        );
      });
  }

  private indexRegistry({ id, name }) {
    ExecutionEnvironmentRegistryAPI.index(id)
      .then(({ data }) => {
        this.addAlertObj(
          taskAlert(
            data.task,
            t`Indexing started for container "${name}".`,
            'success',
          ),
        );
      })
      .catch((err) => {
        const { status, statusText } = err.response;
        this.addAlert(
          t`Container "${name}" could not be indexed.`,
          'danger',
          jsxErrorMessage(status, statusText),
        );
      });
  }

  private addAlertObj(alert: AlertType) {
    this.setState({
      alerts: [...this.state.alerts, alert],
    });
  }

  private addAlert(title, variant, description?) {
    this.addAlertObj({
      description,
      title,
      variant,
    });
  }

  private updateParams(params, callback = null) {
    ParamHelper.updateParams({
      params,
      navigate: (to) => this.props.navigate(to),
      setState: (state) => this.setState(state, callback),
    });
  }
}

export default withRouter(ExecutionEnvironmentRegistryList);
