import { t } from '@lingui/core/macro';
import {
  Label,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';
import { Component } from 'react';
import { Link } from 'react-router';
import { ContainerDistributionAPI } from 'src/api';
import { AppContext, type IAppContextType } from 'src/app-context';
import {
  AlertList,
  type AlertType,
  AppliedFilters,
  BaseHeader,
  ClipboardCopy,
  CompoundFilter,
  ContainerRepositorySidebar,
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
  withRouter,
} from 'src/utilities';
import './execution-environment.scss';

interface ExecutionEnvironmentType {
  pulp_created: string;
  name: string;
  description: string;
  pulp_last_updated: string;
  base_path: string;
  remote: string | null;
  registry_path: string;
}

interface IState {
  alerts: AlertType[];
  itemCount: number;
  items: ExecutionEnvironmentType[];
  loading: boolean;
  params: {
    page?: number;
    page_size?: number;
  };
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
      items: [],
      loading: true,
      params,
      showDeleteModal: false,
      selectedItem: null,
      inputText: '',
    };
  }

  componentDidMount() {
    this.setState({ alerts: (this.context as IAppContextType).alerts || [] });
    (this.context as IAppContextType).setAlerts([]);

    this.queryEnvironments();
  }

  render() {
    const {
      alerts,
      itemCount,
      items,
      loading,
      params,
      showDeleteModal,
      selectedItem,
    } = this.state;

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
            button={pushImagesButton}
          />
        ) : (
          <Main>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <section className='pulp-section execution-environment-layout'>
                <ContainerRepositorySidebar />
                <div className='execution-environment-layout__content'>
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
                </div>
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

    return (
      <Tr data-cy={`ExecutionEnvironmentList-row-${item.name}`} key={index}>
        <Td>
          <Link
            to={formatEEPath(Paths.container.repository.detail, {
              container: item.base_path,
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
          <DateComponent date={item.pulp_created} />
        </Td>
        <Td>
          <DateComponent date={item.pulp_last_updated} />
        </Td>
        <Td>
          <Label>{item.remote ? t`Remote` : t`Local`}</Label>
        </Td>
        <ListItemActions kebabItems={[]} />
      </Tr>
    );
  }

  private queryEnvironments() {
    this.setState({ loading: true }, () =>
      ContainerDistributionAPI.list(this.state.params)
        .then((result) => {
          this.setState({
            items: result.data.results,
            itemCount: result.data.count,
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


}

export default withRouter(ExecutionEnvironmentList);
