import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  Button,
  Modal,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { DropdownItem } from '@patternfly/react-core/deprecated';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';
import { Component } from 'react';
import { Navigate } from 'react-router';
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
  Breadcrumbs,
  CompoundFilter,
  DeleteGroupModal,
  DeleteModal,
  EmptyStateFilter,
  EmptyStateNoData,
  EmptyStateUnauthorized,
  LinkTabs,
  ListItemActions,
  LoadingPage,
  Main,
  NotFound,
  PulpPagination,
  SortTable,
  Typeahead,
  closeAlert,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  ParamHelper,
  type RouteProps,
  filterIsSet,
  jsxErrorMessage,
  withRouter,
} from 'src/utilities';
import GroupDetailRoleManagement from './group-detail-role-management/group-detail-role-management';

interface IState {
  addModalVisible: boolean;
  alerts: AlertType[];
  allUsers: UserType[];
  group: GroupObjectPermissionType;
  inputText: string;
  itemCount: number;
  notFound: boolean;
  options: { id: number; name: string }[];
  originalPermissions: { id: number; name: string }[];
  params: {
    [key: string]: string | number;
    id: string;
    page?: number;
    page_size?: number;
    sort?: string;
    tab: string;
  };
  permissions: string[];
  redirect?: string;
  selected: { id: number; name: string }[];
  showDeleteModal: boolean;
  showUserRemoveModal: UserType | null;
  unauthorized: boolean;
  users: UserType[];
}

class GroupDetail extends Component<RouteProps, IState> {
  static contextType = AppContext;

  userQueryStringParams = ['username', 'first_name', 'last_name', 'email'];

  constructor(props) {
    super(props);

    const id = this.props.routeParams.group;

    const params = ParamHelper.parseParamString(props.location.search, [
      'page',
      'page_size',
    ]);

    this.state = {
      addModalVisible: false,
      alerts: [],
      allUsers: null,
      group: null,
      inputText: '',
      itemCount: 0,
      notFound: false,
      options: undefined,
      originalPermissions: [],
      params: {
        id,
        page: 0,
        page_size: params['page_size'] || 10,
        sort:
          params['sort'] || (params['tab'] === 'access' ? 'role' : 'username'),
        tab: params['tab'] || 'access',
      },
      permissions: [],
      selected: [],
      showDeleteModal: false,
      showUserRemoveModal: null,
      unauthorized: false,
      users: null,
    };
  }

  componentDidMount() {
    const { hasPermission } = this.context as IAppContextType;
    if (!hasPermission('galaxy.view_group')) {
      this.setState({ unauthorized: true });
    } else {
      this.queryGroup();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const id = this.props.routeParams.group;
      const params = ParamHelper.parseParamString(this.props.location.search, [
        'page',
        'page_size',
      ]);
      this.setState({
        params: {
          ...params,
          id,
          page_size: params['page_size'] || 10,
          sort:
            params['sort'] ||
            (params['tab'] === 'access' ? 'role' : 'username'),
          tab: params['tab'] || 'access',
        },
      });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    const {
      addModalVisible,
      alerts,
      group,
      notFound,
      params,
      showDeleteModal,
      showUserRemoveModal,
      unauthorized,
      users,
    } = this.state;
    const { hasPermission } = this.context as IAppContextType;

    if (!group && alerts && alerts.length) {
      return (
        <AlertList
          alerts={alerts}
          closeAlert={(i) =>
            closeAlert(i, {
              alerts,
              setAlerts: (alerts) => this.setState({ alerts }),
            })
          }
        />
      );
    }

    if (unauthorized) {
      return <EmptyStateUnauthorized />;
    }

    if (notFound) {
      return <NotFound />;
    }

    if (!group) {
      return <LoadingPage />;
    }

    if (params.tab == 'users' && !users && !unauthorized) {
      this.queryUsers();
      return <LoadingPage />;
    }

    const tabs = [
      {
        active: params.tab === 'access',
        title: t`Access`,
        link: formatPath(
          Paths.core.group.detail,
          { group: group.id },
          { tab: 'access' },
        ),
      },
      hasPermission('galaxy.view_user') && {
        active: params.tab === 'users',
        title: t`Users`,
        link: formatPath(
          Paths.core.group.detail,
          { group: group.id },
          { tab: 'users' },
        ),
      },
    ];

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
        {addModalVisible ? this.renderAddModal() : null}
        {showDeleteModal ? this.renderGroupDeleteModal() : null}
        {showUserRemoveModal ? this.renderUserRemoveModal() : null}
        <BaseHeader
          title={group.name}
          breadcrumbs={
            <Breadcrumbs
              links={[
                { url: formatPath(Paths.core.group.list), name: t`Groups` },
                { name: group.name },
              ]}
            />
          }
          pageControls={this.renderControls()}
        >
          <div className='pulp-tab-link-container'>
            <div className='tabs'>
              <LinkTabs tabs={tabs} />
            </div>
          </div>
        </BaseHeader>
        <Main data-cy='main-tabs'>
          {params.tab == 'access' ? this.renderGroupDetail() : null}
          {params.tab == 'users' ? this.renderUsers(users) : null}
        </Main>
      </>
    );
  }

  private renderControls() {
    const { hasPermission } = this.context as IAppContextType;

    if (!hasPermission('galaxy.delete_group')) {
      return null;
    }

    return (
      <ToolbarItem>
        <Button
          onClick={() => this.setState({ showDeleteModal: true })}
          variant='secondary'
        >
          {t`Delete`}
        </Button>
      </ToolbarItem>
    );
  }

  private renderGroupDetail() {
    const { params, group } = this.state;
    const { hasPermission } = this.context as IAppContextType;
    const canEdit = hasPermission('galaxy.change_group');

    return (
      <GroupDetailRoleManagement
        addAlert={(title, variant, description) =>
          this.addAlert(title, variant, description)
        }
        canEdit={canEdit}
        group={group}
        nonQueryParams={this.userQueryStringParams}
        params={params}
        updateParams={(p) => this.updateParams(p)}
      />
    );
  }

  private renderAddModal() {
    if (this.state.options === undefined) {
      this.loadOptions();
      return null;
    }

    const close = () => this.setState({ addModalVisible: false, selected: [] });

    return (
      <Modal
        variant='large'
        onClose={close}
        isOpen
        aria-label={t`add-user-modal`}
        title={''}
        header={
          <span className='pf-v5-c-content'>
            <h2>{t`Add selected users to group`}</h2>{' '}
          </span>
        }
        actions={[
          <Button
            key='add'
            variant='primary'
            isDisabled={this.state.selected.length === 0}
            onClick={() =>
              this.addUserToGroup(this.state.selected, this.state.group).then(
                close,
              )
            }
          >
            {t`Add`}
          </Button>,
          <Button key='cancel' variant='link' onClick={close}>
            {t`Cancel`}
          </Button>,
        ]}
      >
        <Typeahead
          results={this.state.options}
          loadResults={(name) =>
            UserAPI.list({ username__contains: name, page_size: 1000 })
              .then((result) => {
                let filteredUsers = [];
                result.data.data.forEach((user) => {
                  filteredUsers.push({
                    id: user.id,
                    name: user.username,
                  });
                });
                filteredUsers = filteredUsers.filter(
                  (x) =>
                    !this.state.selected.find((s) => s.name === x.name) &&
                    !this.state.users.find((u) => u.id === x.id),
                );
                this.setState({
                  options: filteredUsers,
                });
              })
              .catch((e) => {
                const { status, statusText } = e.response;
                this.addAlert(
                  t`Users list could not be displayed.`,
                  'danger',
                  jsxErrorMessage(status, statusText),
                );
              })
          }
          onSelect={(event, selection) => {
            const selectedUser = this.state.options.find(
              (x) => x.name === selection,
            );
            if (selectedUser) {
              const newOptions = this.state.options.filter(
                (x) => x.name !== selection,
              );
              this.setState({
                selected: [...this.state.selected, selectedUser],
                options: newOptions,
              });
            } else {
              const deselectedUser = this.state.selected.find(
                (x) => x.name === selection,
              );
              const newSelected = this.state.selected.filter(
                (x) => x.name !== selection,
              );
              this.setState({
                selected: newSelected,
                options: [...this.state.options, deselectedUser],
              });
            }
          }}
          placeholderText={t`Select users`}
          selections={this.state.selected}
          menuAppendTo={'parent'}
          multiple
          onClear={() =>
            this.setState({
              selected: [],
              options: [...this.state.options, ...this.state.selected],
            })
          }
          style={{ overflowY: 'auto', maxHeight: '350px' }}
        />
      </Modal>
    );
  }

  private renderGroupDeleteModal() {
    const { group, users, itemCount } = this.state;
    const { hasPermission, queueAlert } = this.context as IAppContextType;

    const deleteAction = () => {
      GroupAPI.delete(group.id)
        .then(() => {
          this.setState({
            showDeleteModal: false,
          });
          queueAlert({
            title: t`Group "${group.name}" has been successfully deleted.`,
            variant: 'success',
          });
          this.setState({ redirect: formatPath(Paths.core.group.list) });
        })
        .catch((e) => {
          const { status, statusText } = e.response;
          this.addAlert(
            t`Group "${group.name}" could not be deleted.`,
            'danger',
            jsxErrorMessage(status, statusText),
          );
        });
    };

    const view_user = hasPermission('galaxy.view_user');

    if (!users && view_user) {
      this.queryUsers();
    }

    return (
      <DeleteGroupModal
        count={itemCount}
        cancelAction={() => this.setState({ showDeleteModal: false })}
        deleteAction={deleteAction}
        name={group.name}
        users={users}
        canViewUsers={view_user}
      />
    );
  }

  private renderUserRemoveModal() {
    const group = this.state.group;
    const user = this.state.showUserRemoveModal as UserType;

    const { username } = user;
    const groupname = group.name;

    return (
      <DeleteModal
        cancelAction={() => this.setState({ showUserRemoveModal: null })}
        deleteAction={() => this.deleteUser(user)}
        title={t`Remove user from group?`}
      >
        <Trans>
          User <b>{username}</b> will be removed from group <b>{groupname}</b>.
        </Trans>
      </DeleteModal>
    );
  }

  private addUserToGroup(selectedUsers, group) {
    return Promise.all(
      selectedUsers.map(({ id }) => {
        const user = this.state.allUsers.find((x) => x.id === id);
        return GroupAPI.addUserToGroup(group.id, user.username);
      }),
    )
      .then(() => {
        this.addAlert(
          t`User "${selectedUsers[0].name}" has been successfully added to group "${this.state.group.name}".`,
          'success',
        );
      })
      .catch((e) => {
        const { status, statusText } = e.response;
        this.addAlert(
          t`User "${selectedUsers[0].name}" could not be added to group "${this.state.group.name}".`,
          'danger',
          jsxErrorMessage(status, statusText),
        );
      })
      .then(() => this.queryUsers());
  }

  private loadOptions() {
    UserAPI.list({ page_size: 1000 })
      .then((result) => {
        const options = result.data.results
          .filter((user) => !this.state.users.find((u) => u.id === user.id))
          .map((option) => ({ id: option.id, name: option.username }));
        this.setState({ options, allUsers: result.data.results });
      })
      .catch((e) => {
        const { status, statusText } = e.response;
        this.addAlert(
          t`Users list could not be displayed.`,
          'danger',
          jsxErrorMessage(status, statusText),
        );
      });
  }

  private addAlert(title, variant, description?) {
    this.setState({
      alerts: [
        ...this.state.alerts,
        {
          description,
          title,
          variant,
        },
      ],
    });
  }

  private renderUsers(users) {
    const { itemCount, params } = this.state;
    const { featureFlags, hasPermission } = this.context as IAppContextType;
    const noData =
      itemCount === 0 && !filterIsSet(this.state.params, ['username']);
    const isUserMgmtDisabled = featureFlags.external_authentication;

    if (noData) {
      return (
        <EmptyStateNoData
          title={t`No users yet`}
          description={t`Users will appear once added to this group`}
          button={
            hasPermission('galaxy.change_group') &&
            !isUserMgmtDisabled && (
              <Button
                variant='primary'
                onClick={() => this.setState({ addModalVisible: true })}
              >
                {t`Add`}
              </Button>
            )
          }
        />
      );
    }

    return (
      <section className='pulp-section'>
        <div className='pulp-toolbar'>
          <Toolbar>
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem>
                  <CompoundFilter
                    inputText={this.state.inputText}
                    onChange={(text) => this.setState({ inputText: text })}
                    updateParams={(p) =>
                      this.updateParams(p, () => this.queryUsers())
                    }
                    params={params}
                    filterConfig={[
                      {
                        id: 'username',
                        title: t`Username`,
                      },
                    ]}
                  />
                </ToolbarItem>
              </ToolbarGroup>
              {hasPermission('galaxy.change_group') && !isUserMgmtDisabled && (
                <ToolbarGroup>
                  <ToolbarItem>
                    <Button
                      onClick={() => this.setState({ addModalVisible: true })}
                    >
                      {t`Add`}
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              )}
            </ToolbarContent>
          </Toolbar>

          <PulpPagination
            params={params}
            updateParams={(p) => this.updateParams(p, () => this.queryUsers())}
            count={itemCount}
            isTop
          />
        </div>
        <div>
          <AppliedFilters
            updateParams={(p) => {
              this.updateParams(p, () => this.queryUsers());
              this.setState({ inputText: '' });
            }}
            params={params}
            ignoredParams={[
              'id',
              'page',
              'page_size',
              'sort',
              'tab',
              'role__icontains',
            ]}
          />
        </div>
        {this.renderUsersTable(users)}
        <div style={{ paddingTop: '24px', paddingBottom: '8px' }}>
          <PulpPagination
            params={params}
            updateParams={(p) => this.updateParams(p, () => this.queryUsers())}
            count={itemCount}
          />
        </div>{' '}
      </section>
    );
  }

  private renderUsersTable(users) {
    const { params } = this.state;
    if (users.length === 0) {
      return <EmptyStateFilter />;
    }

    const sortTableOptions = {
      headers: [
        {
          title: t`Username`,
          type: 'alpha',
          id: 'username',
        },
      ],
    };

    return (
      <Table aria-label={t`User list`}>
        <SortTable
          options={sortTableOptions}
          params={params}
          updateParams={(p) => this.updateParams(p, () => this.queryUsers())}
        />
        <Tbody>{users.map((user, i) => this.renderTableRow(user, i))}</Tbody>
      </Table>
    );
  }

  private renderTableRow(user: UserType, index: number) {
    const { featureFlags, hasPermission } = this.context as IAppContextType;
    const isUserMgmtDisabled = featureFlags.external_authentication;
    const dropdownItems = [
      hasPermission('galaxy.change_group') && !isUserMgmtDisabled && (
        <DropdownItem
          key='delete'
          onClick={() => this.setState({ showUserRemoveModal: user })}
        >
          {t`Remove`}
        </DropdownItem>
      ),
    ];
    return (
      <Tr data-cy={`GroupDetail-users-${user.username}`} key={index}>
        <Td>{user.username}</Td>
        <ListItemActions kebabItems={dropdownItems} />
      </Tr>
    );
  }

  private queryUsers() {
    GroupAPI.getUsers(this.state.group.id)
      .then((result) =>
        this.setState({
          users: result.data.results,
          itemCount: result.data.count,
        }),
      )
      .catch((e) => {
        const { status, statusText } = e.response;
        this.addAlert(
          t`Users list could not be displayed.`,
          'danger',
          jsxErrorMessage(status, statusText),
        );
      });
  }

  private queryGroup() {
    GroupAPI.get(this.state.params.id)
      .then((result) => {
        this.setState({ group: result.data });
      })
      .catch((e) => {
        if (e.response.status === 404) {
          this.setState({ notFound: true });
        } else {
          const { status, statusText } = e.response;
          this.addAlert(
            t`Group could not be displayed.`,
            'danger',
            jsxErrorMessage(status, statusText),
          );
        }
      });

    this.setState({
      users: null,
    });
  }

  private deleteUser(user) {
    user.groups = user.groups.filter((group) => {
      return group.id != this.state.params.id;
    });
    const { name } = this.state.group;
    // FIXME: patch
    UserAPI.update(user.id, user)
      .then(() => {
        this.setState({
          showUserRemoveModal: null,
        });
        this.addAlert(
          t`User "${user.username}" has been successfully removed from group "${name}".`,
          'success',
        );
        this.queryUsers();
      })
      .catch((e) => {
        const { status, statusText } = e.response;
        this.addAlert(
          t`User "${user.username}" could not be removed from group "${name}".`,
          'danger',
          jsxErrorMessage(status, statusText),
        );
      });
  }

  private updateParams(params, callback = null) {
    ParamHelper.updateParams({
      params,
      ignoreParams: ['group'],
      navigate: (to) => this.props.navigate(to),
      setState: (state) => this.setState(state, callback),
    });
  }
}

export default withRouter(GroupDetail);
