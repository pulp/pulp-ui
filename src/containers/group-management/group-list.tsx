import { t } from '@lingui/core/macro';
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { DropdownItem } from '@patternfly/react-core/deprecated';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';
import { Component } from 'react';
import { Link, Navigate } from 'react-router';
import {
  GroupAPI,
  type GroupObjectPermissionType,
  UserAPI,
  type UserType,
} from 'src/api';
import { AppContext, type IAppContextType } from 'src/app-context';
import {
  AlertList,
  type AlertType,
  AppliedFilters,
  BaseHeader,
  CompoundFilter,
  DeleteGroupModal,
  EmptyStateFilter,
  EmptyStateNoData,
  EmptyStateUnauthorized,
  GroupModal,
  ListItemActions,
  LoadingSpinner,
  Main,
  PulpPagination,
  SortTable,
  closeAlert,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  type ErrorMessagesType,
  ParamHelper,
  type RouteProps,
  filterIsSet,
  jsxErrorMessage,
  mapErrorMessages,
  withRouter,
} from 'src/utilities';

interface IState {
  params: {
    page?: number;
    page_size?: number;
  };
  redirect?: string;
  loading: boolean;
  itemCount: number;
  alerts: AlertType[];
  groups: GroupObjectPermissionType[];
  createModalVisible: boolean;
  deleteModalCount?: number;
  deleteModalUsers?: UserType[];
  deleteModalVisible: boolean;
  editModalVisible: boolean;
  selectedGroup: GroupObjectPermissionType;
  groupError: ErrorMessagesType;
  unauthorized: boolean;
  inputText: string;
}

class GroupList extends Component<RouteProps, IState> {
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
      params,
      loading: true,
      itemCount: 0,
      alerts: [],
      groups: [],
      createModalVisible: false,
      deleteModalVisible: false,
      editModalVisible: false,
      selectedGroup: null,
      groupError: null,
      unauthorized: false,
      inputText: '',
    };
  }

  componentDidMount() {
    this.setState({ alerts: (this.context as IAppContextType).alerts || [] });
    (this.context as IAppContextType).setAlerts([]);

    const { hasPermission } = this.context as IAppContextType;
    if (!hasPermission('galaxy.view_group')) {
      this.setState({ unauthorized: true });
    } else {
      this.queryGroups();
    }
  }

  render() {
    const {
      redirect,
      itemCount,
      params,
      loading,
      createModalVisible,
      deleteModalVisible,
      editModalVisible,
      alerts,
      groups,
      unauthorized,
    } = this.state;

    const { hasPermission } = this.context as IAppContextType;
    const noData =
      groups.length === 0 && !filterIsSet(params, ['name__icontains']);

    if (redirect) {
      return <Navigate to={redirect} />;
    }

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
        {createModalVisible ? this.renderCreateModal() : null}
        {deleteModalVisible ? this.renderDeleteModal() : null}
        {editModalVisible ? this.renderEditModal() : null}
        <BaseHeader title={t`Groups`} />
        {unauthorized ? (
          <EmptyStateUnauthorized />
        ) : loading ? (
          <LoadingSpinner />
        ) : noData ? (
          <EmptyStateNoData
            title={t`No groups yet`}
            description={t`Groups will appear once created`}
            button={
              hasPermission('galaxy.add_group') && (
                <Button
                  variant='primary'
                  onClick={() => this.setState({ createModalVisible: true })}
                >
                  {t`Create`}
                </Button>
              )
            }
          />
        ) : (
          <Main>
            <section className='pulp-section'>
              <div className='pulp-toolbar'>
                <Toolbar>
                  <ToolbarContent>
                    <ToolbarGroup>
                      <ToolbarItem>
                        <CompoundFilter
                          inputText={this.state.inputText}
                          onChange={(val) => this.setState({ inputText: val })}
                          updateParams={(p) =>
                            this.updateParams(p, () => this.queryGroups())
                          }
                          params={params}
                          filterConfig={[
                            {
                              id: 'name__icontains',
                              title: t`Group name`,
                            },
                          ]}
                        />
                      </ToolbarItem>
                    </ToolbarGroup>
                    {hasPermission('galaxy.add_group') && (
                      <ToolbarGroup>
                        <ToolbarItem>
                          <Button
                            onClick={() =>
                              this.setState({ createModalVisible: true })
                            }
                          >{t`Create`}</Button>
                        </ToolbarItem>
                      </ToolbarGroup>
                    )}
                  </ToolbarContent>
                </Toolbar>

                <PulpPagination
                  params={params}
                  updateParams={(p) =>
                    this.updateParams(p, () => this.queryGroups())
                  }
                  count={itemCount}
                  isTop
                />
              </div>
              <div>
                <AppliedFilters
                  updateParams={(p) => {
                    this.updateParams(p, () => this.queryGroups());
                    this.setState({ inputText: '' });
                  }}
                  params={params}
                  ignoredParams={['page_size', 'page', 'sort']}
                  niceNames={{
                    name__icontains: t`Group name`,
                  }}
                />
              </div>
              {loading ? <LoadingSpinner /> : this.renderTable(params)}

              <PulpPagination
                params={params}
                updateParams={(p) =>
                  this.updateParams(p, () => this.queryGroups())
                }
                count={itemCount}
              />
            </section>
          </Main>
        )}
      </>
    );
  }

  private renderCreateModal() {
    return (
      <GroupModal
        onCancel={() =>
          this.setState({ createModalVisible: false, groupError: null })
        }
        onSave={(value) => this.saveGroup(value)}
        clearErrors={() => this.setState({ groupError: null })}
        errorMessage={this.state.groupError}
      />
    );
  }

  private renderEditModal() {
    return (
      <GroupModal
        onCancel={() =>
          this.setState({ editModalVisible: false, groupError: null })
        }
        onSave={(value) => this.editGroup(value)}
        clearErrors={() => this.setState({ groupError: null })}
        group={this.state.selectedGroup}
        errorMessage={this.state.groupError}
      />
    );
  }

  private renderDeleteModal() {
    const name = this.state.selectedGroup && this.state.selectedGroup.name;
    const { deleteModalUsers: users, deleteModalCount: count } = this.state;
    const { hasPermission } = this.context as IAppContextType;
    const view_user = hasPermission('galaxy.view_user');

    if (!users && view_user) {
      this.queryUsers();
    }

    return (
      <DeleteGroupModal
        count={count}
        cancelAction={() => this.hideDeleteModal()}
        deleteAction={() => this.selectedGroup(this.state.selectedGroup)}
        name={name}
        users={users}
        canViewUsers={view_user}
      />
    );
  }

  private hideDeleteModal() {
    this.setState({
      deleteModalCount: null,
      deleteModalUsers: null,
      deleteModalVisible: false,
    });
  }

  private queryUsers() {
    UserAPI.list({
      groups__name: this.state.selectedGroup.name,
      page: 0,
      page_size: 10,
    })
      .then((result) =>
        this.setState({
          deleteModalUsers: result.data.data,
          deleteModalCount: result.data.meta.count,
        }),
      )
      .catch((e) => {
        const { status, statusText } = e.response;
        this.setState({
          deleteModalVisible: false,
          selectedGroup: null,
          alerts: [
            ...this.state.alerts,
            {
              variant: 'danger',
              title: t`Users list could not be displayed.`,
              description: jsxErrorMessage(status, statusText),
            },
          ],
        });
      });
  }

  private saveGroup(value) {
    GroupAPI.create({ name: value })
      .then((result) => {
        this.setState({
          redirect: formatPath(Paths.core.group.detail, {
            group: result.data.id,
          }),
          createModalVisible: false,
        });
      })
      .catch((error) => this.setState({ groupError: mapErrorMessages(error) }));
  }

  private editGroup(value) {
    GroupAPI.update(this.state.selectedGroup.id.toString(), {
      name: value,
      pulp_href: this.state.selectedGroup.pulp_href,
      id: this.state.selectedGroup.id,
    })
      .then((result) => {
        this.setState({
          redirect: '/group/' + result.data.id,
          editModalVisible: false,
          selectedGroup: null,
        });
      })
      .catch(() =>
        this.setState({
          editModalVisible: false,
          selectedGroup: null,
          alerts: [
            ...this.state.alerts,
            {
              variant: 'danger',
              title: t`Changes to group "${this.state.selectedGroup.name}" could not be saved.`,
            },
          ],
        }),
      );
  }

  private renderTable(params) {
    const { groups } = this.state;
    if (groups.length === 0) {
      return <EmptyStateFilter />;
    }

    const sortTableOptions = {
      headers: [
        {
          title: t`Group name`,
          type: 'alpha',
          id: 'name',
        },
        {
          title: '',
          type: 'none',
          id: 'kebab',
        },
      ],
    };

    return (
      <Table aria-label={t`Group list`}>
        <SortTable
          options={sortTableOptions}
          params={params}
          updateParams={(p) => this.updateParams(p, () => this.queryGroups())}
        />
        <Tbody>{groups.map((group, i) => this.renderTableRow(group, i))}</Tbody>
      </Table>
    );
  }

  private renderTableRow(group, index: number) {
    const { hasPermission } = this.context as IAppContextType;
    const dropdownItems = [
      hasPermission('galaxy.delete_group') && (
        <DropdownItem
          aria-label='Delete'
          key='delete'
          onClick={() => {
            this.setState({
              selectedGroup: group,
              deleteModalVisible: true,
            });
          }}
        >
          {t`Delete`}
        </DropdownItem>
      ),
    ];
    return (
      <Tr data-cy={`GroupList-row-${group.name}`} key={index}>
        <Td>
          <Link
            to={formatPath(Paths.core.group.detail, {
              group: group.id,
            })}
          >
            {group.name}
          </Link>
        </Td>
        <ListItemActions kebabItems={dropdownItems} />
      </Tr>
    );
  }

  private updateParams(params, callback = null) {
    ParamHelper.updateParams({
      params,
      navigate: (to) => this.props.navigate(to),
      setState: (state) => this.setState(state, callback),
    });
  }

  private selectedGroup(group) {
    GroupAPI.delete(group.id)
      .then(() => {
        this.hideDeleteModal();
        this.setState({
          loading: true,
          selectedGroup: null,
          alerts: [
            ...this.state.alerts,
            {
              variant: 'success',
              title: t`Group "${group.name}" has been successfully deleted.`,
            },
          ],
        });
        this.queryGroups();
      })
      .catch(() =>
        this.setState({
          alerts: [
            ...this.state.alerts,
            {
              variant: 'danger',
              title: t`Error deleting group.`,
            },
          ],
        }),
      );
  }

  private queryGroups() {
    this.setState({ loading: true }, () =>
      GroupAPI.list(this.state.params)
        .then((result) => {
          this.setState({
            groups: result.data.results,
            itemCount: result.data.count,
            loading: false,
          });
        })
        .catch((e) => {
          const { status, statusText } = e.response;
          this.setState({
            groups: [],
            itemCount: 0,
            loading: false,
            alerts: [
              ...this.state.alerts,
              {
                variant: 'danger',
                title: t`Groups list could not be displayed.`,
                description: jsxErrorMessage(status, statusText),
              },
            ],
          });
        }),
    );
  }
}

export default withRouter(GroupList);
