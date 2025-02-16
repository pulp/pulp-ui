import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { DropdownItem } from '@patternfly/react-core/deprecated';
import { Td } from '@patternfly/react-table';
import { Component } from 'react';
import { Link, Navigate } from 'react-router';
import { RoleAPI, type RoleType } from 'src/api';
import { AppContext, type IAppContextType } from 'src/app-context';
import {
  AlertList,
  type AlertType,
  AppliedFilters,
  BaseHeader,
  CompoundFilter,
  DateComponent,
  DeleteModal,
  EmptyStateFilter,
  EmptyStateNoData,
  ExpandableRow,
  ListItemActions,
  LoadingSpinner,
  Main,
  PermissionCategories,
  PulpPagination,
  RoleListTable,
  Tooltip,
  closeAlert,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  ParamHelper,
  type RouteProps,
  filterIsSet,
  jsxErrorMessage,
  parsePulpIDFromURL,
  translateLockedRole,
  withRouter,
} from 'src/utilities';

interface IState {
  roles: RoleType[];
  roleCount: number;
  redirect?: string;
  alerts: AlertType[];
  loading: boolean;
  inputText: string;
  params: {
    page?: number;
    page_size?: number;
  };
  selectedRole: RoleType[];
  expandedRoleNames: string[];
  roleToEdit: RoleType;
  showDeleteModal: boolean;
}

export class RoleList extends Component<RouteProps, IState> {
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
      redirect: null,
      roles: [],
      alerts: [],
      loading: true,
      inputText: '',
      params,
      roleCount: 0,
      selectedRole: null,
      expandedRoleNames: [],
      roleToEdit: null,
      showDeleteModal: false,
    };
  }

  componentDidMount() {
    this.queryRoles();
  }

  render() {
    const {
      redirect,
      params,
      loading,
      roleCount,
      alerts,
      showDeleteModal,
      roleToEdit,
      roles,
    } = this.state;

    const noData =
      roleCount === 0 && !filterIsSet(params, ['name__icontains', 'locked']);

    if (redirect) {
      return <Navigate to={redirect} />;
    }

    const addRoles = (
      <Link to={formatPath(Paths.core.role.create)}>
        <Button variant={'primary'}>{t`Add roles`}</Button>
      </Link>
    );

    const tableHeader = [
      {
        title: '',
        type: 'none',
        id: 'expander',
      },
      {
        title: t`Role name`,
        type: 'alpha',
        id: 'name',
      },
      {
        title: t`Description`,
        type: 'none',
        id: 'description',
      },
      {
        title: t`Created`,
        type: 'number',
        id: 'pulp_created',
      },
      {
        title: t`Editable`,
        type: 'none',
        id: 'locked',
      },
      {
        title: '',
        type: 'none',
        id: 'kebab',
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
        {showDeleteModal && roleToEdit && (
          <DeleteModal
            cancelAction={() =>
              this.setState({ showDeleteModal: false, roleToEdit: null })
            }
            deleteAction={() => this.deleteRole(roleToEdit)}
            title={t`Delete role?`}
            data-cy='DeleteModal'
          >
            <Trans>
              <p>
                Role <b>{roleToEdit.name}</b> will be permanently deleted.
              </p>
              <p>
                This will also remove all associated permissions under this
                role.
              </p>
            </Trans>
          </DeleteModal>
        )}
        <BaseHeader title={t`Roles`} />
        {noData && !loading ? (
          <EmptyStateNoData
            title={t`There are currently no roles`}
            description={t`Please add a role by using the button below.`}
            button={addRoles}
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
                              this.updateParams(p, () => this.queryRoles())
                            }
                            params={params}
                            filterConfig={[
                              {
                                id: 'name__icontains',
                                title: t`Role name`,
                              },

                              {
                                id: 'locked',
                                title: t`Editable`,
                                inputType: 'select',
                                options: [
                                  {
                                    id: 'true',
                                    title: t`Built-in`,
                                  },
                                  {
                                    id: 'false',
                                    title: t`Editable`,
                                  },
                                ],
                              },
                            ]}
                          />
                        </ToolbarItem>
                        {/* TODO fix with Pulp API  <ToolbarItem>{addRoles}</ToolbarItem> */}
                      </ToolbarGroup>
                    </ToolbarContent>
                  </Toolbar>
                  <PulpPagination
                    params={params}
                    updateParams={(p) =>
                      this.updateParams(p, () => this.queryRoles())
                    }
                    count={roleCount}
                    isTop
                  />
                </div>
                <div>
                  <AppliedFilters
                    updateParams={(p) => {
                      this.updateParams(p, () => this.queryRoles());
                      this.setState({ inputText: '' });
                    }}
                    params={params}
                    ignoredParams={['page_size', 'page', 'sort', 'ordering']}
                    niceValues={{
                      locked: { true: t`Built-in`, false: t`Editable` },
                    }}
                    niceNames={{
                      locked: t`Editable`,
                      name__icontains: t`Role name`,
                    }}
                  />
                </div>
                <>
                  {' '}
                  {roleCount ? (
                    <RoleListTable
                      params={this.state.params}
                      updateParams={(p) => {
                        this.updateParams(p, () => this.queryRoles());
                      }}
                      tableHeader={{ headers: tableHeader }}
                    >
                      {roles.map((role, i) => (
                        <ExpandableRow
                          key={role.name}
                          expandableRowContent={
                            <PermissionCategories
                              permissions={role.permissions}
                              showCustom
                            />
                          }
                          data-cy={`RoleListTable-ExpandableRow-row-${role.name}`}
                          colSpan={6}
                          rowIndex={i}
                        >
                          <Td data-cy='name-field'>{role.name}</Td>
                          <Td>
                            {translateLockedRole(role.name, role.description)}
                          </Td>
                          <Td>
                            <DateComponent date={role.pulp_created} />
                          </Td>

                          <Td>
                            {role.locked ? (
                              <Tooltip
                                content={t`Built-in roles cannot be edited or deleted.`}
                              >
                                <span
                                  style={{ whiteSpace: 'nowrap' }}
                                >{t`Built-in`}</span>
                              </Tooltip>
                            ) : (
                              t`Editable`
                            )}
                          </Td>
                          <ListItemActions
                            kebabItems={this.renderDropdownItems(role)}
                          />
                        </ExpandableRow>
                      ))}
                    </RoleListTable>
                  ) : (
                    <EmptyStateFilter />
                  )}
                  <PulpPagination
                    params={params}
                    updateParams={(p) =>
                      this.updateParams(p, () => this.queryRoles())
                    }
                    count={roleCount}
                  />
                </>
              </section>
            )}
          </Main>
        )}
      </>
    );
  }

  private deleteRole({ pulp_href, name }) {
    const roleID = parsePulpIDFromURL(pulp_href);
    RoleAPI.delete(roleID)
      .then(() =>
        this.addAlert(
          t`Role "${name}" has been successfully deleted.`,
          'success',
        ),
      )
      .catch((e) => {
        const { status, statusText } = e.response;
        this.addAlert(
          t`Role "${name}" could not be deleted.`,
          'danger',
          jsxErrorMessage(status, statusText),
        );
      })
      .then(() => {
        this.queryRoles();
        this.setState({ showDeleteModal: false, roleToEdit: null });
      });
  }

  private renderDropdownItems = (role) => {
    // TODO: fix to work with Pulp API
    return [];

    const { pulp_href, locked } = role;
    const roleID = parsePulpIDFromURL(pulp_href);

    const editItem = (
      <DropdownItem
        key='edit'
        isDisabled={locked}
        onClick={() =>
          this.setState({
            redirect: formatPath(Paths.core.role.edit, { role: roleID }),
          })
        }
      >
        {t`Edit`}
      </DropdownItem>
    );
    const deleteItem = (
      <DropdownItem
        key='delete'
        isDisabled={locked}
        onClick={() =>
          this.setState({
            showDeleteModal: true,
            roleToEdit: role,
          })
        }
      >
        {t`Delete`}
      </DropdownItem>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hasPermission } = this.context as IAppContextType;
    const dropdownItems = [
      // hasPermission('galaxy.change_containerregistryremote') &&
      locked ? (
        <Tooltip key='edit' content={t`Built-in roles cannot be edited.`}>
          {editItem}
        </Tooltip>
      ) : (
        editItem
      ),
      // hasPermission('galaxy.delete_containerregistryremote') &&
      locked ? (
        <Tooltip key='delete' content={t`Built-in roles cannot be deleted.`}>
          {deleteItem}
        </Tooltip>
      ) : (
        deleteItem
      ),
    ];

    return dropdownItems;
  };

  private queryRoles = () => {
    const { params } = this.state;
    this.setState({ loading: true }, () => {
      RoleAPI.list(params)
        .then((result) => {
          this.setState({
            roles: result.data.results,
            roleCount: result.data.count,
            loading: false,
          });
        })
        .catch((err) => {
          const { status, statusText } = err.response;
          this.setState({
            roleCount: 0,
            loading: false,
          });
          this.addAlert(
            t`Roles list could not be displayed.`,
            'danger',
            jsxErrorMessage(status, statusText),
          );
        });
    });
  };

  private updateParams(params, callback = null) {
    ParamHelper.updateParams({
      params,
      navigate: (to) => this.props.navigate(to),
      setState: (state) => this.setState(state, callback),
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
}

export default withRouter(RoleList);
