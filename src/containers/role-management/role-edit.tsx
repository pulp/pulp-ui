import { t } from '@lingui/macro';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { RoleAPI, type RoleType } from 'src/api';
import {
  AlertList,
  type AlertType,
  LoadingPage,
  Main,
  NotFound,
  RoleForm,
  RoleHeader,
  closeAlert,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  type ErrorMessagesType,
  type RouteProps,
  jsxErrorMessage,
  mapNetworkErrors,
  parsePulpIDFromURL,
  translateLockedRole,
  validateInput,
  withRouter,
} from 'src/utilities';

interface IState {
  alerts: AlertType[];
  description: string;
  editPermissions: boolean;
  errorMessages: Record<string, string>;
  inputText: string;
  itemCount: number;
  name: string;
  nameError: boolean;
  notFound: boolean;
  options: { id: number; name: string }[];
  originalPermissions: string[];
  params: {
    id: string;
  };
  permissions: string[];
  redirect?: string;
  role: RoleType;
  roleError: ErrorMessagesType;
  saving: boolean;
  selected: { id: number; name: string }[];
  showDeleteModal: boolean;
}

class EditRole extends Component<RouteProps, IState> {
  constructor(props) {
    super(props);

    const id = this.props.routeParams.role;

    this.state = {
      alerts: [],
      description: null,
      editPermissions: false,
      errorMessages: {},
      inputText: '',
      itemCount: 0,
      name: null,
      nameError: false,
      notFound: false,
      options: undefined,
      originalPermissions: [],
      params: {
        id,
      },
      permissions: [],
      role: null,
      roleError: null,
      saving: false,
      selected: [],
      showDeleteModal: false,
    };
  }

  componentDidMount() {
    this.setState({ editPermissions: true });

    RoleAPI.get(this.state.params.id)
      .then((result) => {
        this.setState({
          role: result.data,
          description: result.data.description,
          name: result.data.name,
          originalPermissions: result.data.permissions,
        });
      })
      .catch((e) => {
        const { status, statusText } = e.response;
        this.setState({ notFound: true });
        this.addAlert(
          t`Role "${this.state.role.name}" could not be displayed.`,
          'danger',
          jsxErrorMessage(status, statusText),
        );
      });
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    const {
      alerts,
      description,
      editPermissions,
      errorMessages,
      name,
      notFound,
      role,
      saving,
    } = this.state;

    if (!role && alerts && alerts.length) {
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

    if (notFound) {
      return <NotFound />;
    }

    if (!role) {
      return <LoadingPage />;
    }

    const breadcrumbs = [
      { url: formatPath(Paths.core.role.list), name: t`Roles` },
      { name: role.name },
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
        <RoleHeader
          title={editPermissions ? t`Edit role permissions` : role.name}
          subTitle={translateLockedRole(role.name, role.description)}
          breadcrumbs={breadcrumbs}
        />
        <Main>
          <section className='pulp-section'>
            <RoleForm
              {...this.state}
              name={name}
              nameDisabled
              description={description}
              descriptionHelperText={errorMessages['description']}
              descriptionValidated={
                errorMessages['description'] ? 'error' : null
              }
              onDescriptionChange={(value) => {
                this.setState({ description: value }, () => {
                  const errors = validateInput(
                    value,
                    'description',
                    this.state.errorMessages,
                  );
                  this.setState({ errorMessages: errors });
                });
              }}
              saving={saving}
              saveRole={this.editRole}
              isSavingDisabled={
                'description' in errorMessages || 'name' in errorMessages
              }
              cancelRole={this.cancelRole}
            />
          </section>
        </Main>
      </>
    );
  }

  private cancelRole = () => {
    this.setState({
      errorMessages: {},
      redirect: formatPath(Paths.core.role.list),
    });
  };

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

  private editRole = (permissions) => {
    this.setState({ saving: true }, () => {
      const { pulp_href } = this.state.role;
      const roleID = parsePulpIDFromURL(pulp_href) + '/';
      const { name, description } = this.state;

      RoleAPI.updatePermissions(roleID, { name, description, permissions })
        .then(() =>
          this.setState({ redirect: formatPath(Paths.core.role.list) }),
        )
        .catch((err) => {
          const { status, statusText } = err.response;
          if (err.response.status === 400) {
            const errors = mapNetworkErrors(err);

            this.setState({ saving: false, errorMessages: errors });
          } else if (status === 404) {
            this.setState({
              errorMessages: {},
              alerts: this.state.alerts.concat({
                variant: 'danger',
                title: t`Changes to role "${name}" could not be saved.`,
                description: jsxErrorMessage(status, statusText),
              }),
              saving: false,
            });
          }
        });
    });
  };

  private toError(validated: boolean) {
    return validated ? 'default' : 'error';
  }
}

export default withRouter(EditRole);
