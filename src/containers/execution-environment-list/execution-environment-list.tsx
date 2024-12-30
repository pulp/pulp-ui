import { t } from '@lingui/core/macro';
import {
  Button,
  Label,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { DropdownItem } from '@patternfly/react-core/deprecated';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';
import { Component } from 'react';
import { Link } from 'react-router';
import {
  ExecutionEnvironmentAPI,
  ExecutionEnvironmentRemoteAPI,
} from 'src/api';
import { AppContext, type IAppContextType } from 'src/app-context';
import {
  AlertList,
  type AlertType,
  AppliedFilters,
  BaseHeader,
  ClipboardCopy,
  CompoundFilter,
  ContainerRepositoryForm,
  DateComponent,
  DeleteExecutionEnvironmentModal,
  EmptyStateFilter,
  EmptyStateNoData,
  ExternalLink,
  HelpButton,
  ListItemActions,
  LoadingSpinner,
  Main,
  PulpPagination,
  SortTable,
  Tooltip,
  closeAlert,
} from 'src/components';
import { Paths, formatEEPath } from 'src/paths';
import {
  ParamHelper,
  type RouteProps,
  filterIsSet,
  getContainersURL,
  taskAlert,
  withRouter,
} from 'src/utilities';
import './execution-environment.scss';

interface ExecutionEnvironmentType {
  created_at: string;
  name: string;
  description: string;
  updated_at: string;
  pulp: {
    distribution: { base_path: string };
    repository: { pulp_id: string; version: string };
  };
}

interface IState {
  alerts: AlertType[];
  itemCount: number;
  itemToEdit?: ExecutionEnvironmentType;
  items: ExecutionEnvironmentType[];
  loading: boolean;
  params: {
    page?: number;
    page_size?: number;
  };
  showRemoteModal: boolean;
  showDeleteModal: boolean;
  selectedItem: ExecutionEnvironmentType;
  inputText: string;
}

class ExecutionEnvironmentList extends Component<RouteProps, IState> {
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
      itemToEdit: null,
      items: [],
      loading: true,
      params,
      showRemoteModal: false,
      showDeleteModal: false,
      selectedItem: null,
      inputText: '',
    };
  }

  componentDidMount() {
    this.queryEnvironments();
    this.setState({ alerts: (this.context as IAppContextType).alerts });
  }

  componentWillUnmount() {
    (this.context as IAppContextType).setAlerts([]);
  }

  render() {
    const {
      alerts,
      itemCount,
      itemToEdit,
      items,
      loading,
      params,
      showRemoteModal,
      showDeleteModal,
      selectedItem,
    } = this.state;
    const { hasPermission } = this.context as IAppContextType;

    const noData =
      items.length === 0 && !filterIsSet(params, ['name__icontains']);

    const tlsVerify = window.location.protocol == 'https:';
    const serverURL = getContainersURL({ name: '' }).replace(/\/$/, '');
    const containerURL = getContainersURL({ name: 'example', tag: 'latest' });
    const instructions = (
      <ClipboardCopy isCode isReadOnly isExpanded variant='expansion'>
        podman login --tls-verify={tlsVerify.toString()} {serverURL}
        {'\n'}
        podman image tag example {containerURL}
        {'\n'}
        podman push --tls-verify={tlsVerify.toString()} {containerURL}
        {'\n'}
      </ClipboardCopy>
    );

    const pushImagesButton = (
      <HelpButton
        content={
          <>
            {instructions}
            <ExternalLink href='https://docs.pulpproject.org/'>{t`Documentation`}</ExternalLink>
          </>
        }
        hasAutoWidth
        header={t`Push container images`}
        prefix={
          <span data-cy='push-images-button'>{t`Push container images`}</span>
        }
      />
    );

    const addRemoteButton = hasPermission(
      'container.add_containernamespace',
    ) && (
      <Button
        onClick={() =>
          this.setState({
            showRemoteModal: true,
            itemToEdit: {} as ExecutionEnvironmentType,
          })
        }
        variant='primary'
      >
        {t`Add container`}
      </Button>
    );

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
        {showRemoteModal && this.renderRemoteModal(itemToEdit)}
        <BaseHeader title={t`Containers`} />

        {showDeleteModal && (
          <DeleteExecutionEnvironmentModal
            selectedItem={selectedItem ? selectedItem.name : ''}
            closeAction={() =>
              this.setState({ showDeleteModal: false, selectedItem: null })
            }
            afterDelete={() => this.queryEnvironments()}
            addAlert={(text, variant, description = undefined) =>
              this.setState({
                alerts: alerts.concat([
                  { title: text, variant: variant, description: description },
                ]),
              })
            }
          />
        )}
        {noData && !loading ? (
          <EmptyStateNoData
            title={t`No container repositories yet`}
            description={t`You currently have no container repositories. Add a container repository via the CLI to get started.`}
            button={
              <div>
                {addRemoteButton}
                {addRemoteButton && pushImagesButton ? <div>&nbsp;</div> : null}
                {pushImagesButton}
              </div>
            }
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
                              this.updateParams(p, () =>
                                this.queryEnvironments(),
                              )
                            }
                            params={params}
                            filterConfig={[
                              {
                                id: 'name__icontains',
                                title: t`Container repository name`,
                              },
                            ]}
                          />
                        </ToolbarItem>
                        <ToolbarItem>{addRemoteButton}</ToolbarItem>
                        <ToolbarItem>
                          <div style={{ paddingTop: '6px' }}>
                            {pushImagesButton}
                          </div>
                        </ToolbarItem>
                      </ToolbarGroup>
                    </ToolbarContent>
                  </Toolbar>

                  <PulpPagination
                    params={params}
                    updateParams={(p) =>
                      this.updateParams(p, () => this.queryEnvironments())
                    }
                    count={itemCount}
                    isTop
                  />
                </div>
                <div>
                  <AppliedFilters
                    updateParams={(p) => {
                      this.updateParams(p, () => this.queryEnvironments());
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
                    this.updateParams(p, () => this.queryEnvironments())
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
          title: t`Container repository name`,
          type: 'alpha',
          id: 'name',
        },
        {
          title: t`Description`,
          type: 'alpha',
          id: 'description',
        },
        {
          title: t`Created`,
          type: 'numeric',
          id: 'created_at',
        },
        {
          title: t`Last modified`,
          type: 'alpha',
          id: 'updated_at',
        },
        {
          title: t`Container registry type`,
          type: 'none',
          id: 'type',
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
            this.updateParams(p, () => this.queryEnvironments())
          }
        />
        <Tbody>{items.map((user, i) => this.renderTableRow(user, i))}</Tbody>
      </Table>
    );
  }

  private renderTableRow(item, index: number) {
    const description = item.description;

    const permissions = item.namespace.my_permissions;

    const canEdit =
      permissions.includes('container.change_containernamespace') ||
      permissions.includes('container.namespace_change_containerdistribution');

    const { hasPermission } = this.context as IAppContextType;

    const dropdownItems = [
      canEdit && (
        <DropdownItem
          key='edit'
          onClick={() =>
            this.setState({
              showRemoteModal: true,
              itemToEdit: { ...item },
            })
          }
        >
          {t`Edit`}
        </DropdownItem>
      ),
      item.pulp.repository.remote && canEdit && (
        <DropdownItem key='sync' onClick={() => this.sync(item.name)}>
          {t`Sync from registry`}
        </DropdownItem>
      ),
      hasPermission('container.delete_containerrepository') && (
        <DropdownItem
          key='delete'
          onClick={() =>
            this.setState({ selectedItem: item, showDeleteModal: true })
          }
        >
          {t`Delete`}
        </DropdownItem>
      ),
    ].filter((truthy) => truthy);

    return (
      <Tr data-cy={`ExecutionEnvironmentList-row-${item.name}`} key={index}>
        <Td>
          <Link
            to={formatEEPath(Paths.container.repository.detail, {
              container: item.pulp.distribution.base_path,
            })}
          >
            {item.name}
          </Link>
        </Td>
        {description ? (
          <Td className={'pf-m-truncate'}>
            <Tooltip content={description}>{description}</Tooltip>
          </Td>
        ) : (
          <Td />
        )}
        <Td>
          <DateComponent date={item.created_at} />
        </Td>
        <Td>
          <DateComponent date={item.updated_at} />
        </Td>
        <Td>
          <Label>{item.pulp.repository.remote ? t`Remote` : t`Local`}</Label>
        </Td>
        <ListItemActions kebabItems={dropdownItems} />
      </Tr>
    );
  }

  private renderRemoteModal(itemToEdit) {
    const { name, namespace, description, pulp } = itemToEdit;
    const {
      id: remoteId,
      registry,
      upstream_name,
      include_tags,
      exclude_tags,
    } = pulp?.repository?.remote || {};
    const remote = pulp?.repository ? !!pulp?.repository?.remote : true; // add only supports remote
    const isNew = !pulp?.repository; // only exists in real data
    const distributionPulpId = pulp?.distribution?.id;
    const { alerts } = this.state;
    return (
      <ContainerRepositoryForm
        isRemote={!!remote}
        isNew={isNew}
        name={name}
        namespace={namespace?.name}
        description={description}
        upstreamName={upstream_name}
        registry={registry}
        excludeTags={exclude_tags || []}
        includeTags={include_tags || []}
        permissions={namespace?.my_permissions || []}
        remoteId={remoteId}
        distributionPulpId={distributionPulpId}
        onSave={(promise, form) => {
          promise.then(() => {
            this.setState(
              {
                showRemoteModal: false,
                itemToEdit: null,
                alerts: alerts.concat({
                  variant: 'success',
                  title: isNew
                    ? t`Container "${form.name}" has been added successfully.`
                    : t`Saved changes to container "${form.name}".`,
                }),
              },
              () => this.queryEnvironments(),
            );
          });
        }}
        onCancel={() =>
          this.setState({
            showRemoteModal: false,
            itemToEdit: null,
          })
        }
      />
    );
  }

  private queryEnvironments() {
    this.setState({ loading: true }, () =>
      ExecutionEnvironmentAPI.list(this.state.params)
        .then((result) => {
          this.setState({
            items: result.data.data,
            itemCount: result.data.meta.count,
            loading: false,
          });
        })
        .catch((e) =>
          this.addAlert(t`Error loading environments.`, 'danger', e?.message),
        ),
    );
  }

  private updateParams(params, callback = null) {
    ParamHelper.updateParams({
      params,
      navigate: (to) => this.props.navigate(to),
      setState: (state) => this.setState(state, callback),
    });
  }

  private addAlert(title, variant, description?) {
    this.addAlertObj({
      description,
      title,
      variant,
    });
  }

  private addAlertObj(alert) {
    this.setState({
      alerts: [...this.state.alerts, alert],
    });
  }

  private sync(name) {
    ExecutionEnvironmentRemoteAPI.sync(name)
      .then(({ data }) => {
        this.addAlertObj(
          taskAlert(data.task, t`Sync started for container "${name}".`),
        );
      })
      .catch(() => this.addAlert(t`Sync failed for ${name}`, 'danger'));
  }
}

export default withRouter(ExecutionEnvironmentList);
