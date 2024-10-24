import { t } from '@lingui/macro';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { RoleAPI } from 'src/api';
import { type AlertType, Main, RoleForm, RoleHeader } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  type RouteProps,
  jsxErrorMessage,
  mapNetworkErrors,
  validateInput,
  withRouter,
} from 'src/utilities';

interface IState {
  saving: boolean;
  errorMessages: Record<string, string>;
  redirect?: string;
  permissions: string[];
  name: string;
  description: string;
  nameHelperText: string;
  nameValidated: string;
  alerts: AlertType[];
}

class RoleCreate extends Component<RouteProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      nameValidated: '',
      nameHelperText: '',
      errorMessages: {},
      permissions: [],
      name: '',
      description: '',
      alerts: [],
    };
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    const { errorMessages, description, name, saving } = this.state;

    const breadcrumbs = [
      { url: formatPath(Paths.core.role.list), name: t`Roles` },
      { name: t`Create new role` },
    ];

    return (
      <>
        <RoleHeader title={t`Create a new role`} breadcrumbs={breadcrumbs} />
        <Main>
          <section className='pulp-section'>
            <RoleForm
              nameValidated={errorMessages['name'] ? 'error' : null}
              nameHelperText={errorMessages['name']}
              name={name}
              onNameChange={(value) => {
                this.setState({ name: value }, () => {
                  const errors = validateInput(
                    value,
                    'name',
                    this.state.errorMessages,
                  );
                  this.setState({ errorMessages: errors });
                });
              }}
              description={description}
              descriptionValidated={
                errorMessages['description'] ? 'error' : null
              }
              descriptionHelperText={errorMessages['description']}
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
              saveRole={this.createRole}
              isSavingDisabled={
                'description' in errorMessages || 'name' in errorMessages
              }
              cancelRole={this.cancelRole}
              saving={saving}
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

  private createRole = (permissions) => {
    this.setState({ saving: true }, () => {
      const { name, description } = this.state;

      RoleAPI.create({ name, description, permissions })
        .then(() =>
          this.setState({
            redirect: formatPath(Paths.core.role.list),
            errorMessages: null,
          }),
        )
        .catch((err) => {
          const { status, statusText } = err.response;

          if (status === 400) {
            const errors = mapNetworkErrors(err);

            this.setState({
              saving: false,
              errorMessages: errors,
            });
          } else if (status === 404) {
            this.setState({
              errorMessages: {},
              alerts: this.state.alerts.concat({
                variant: 'danger',
                title: t`Role "${this.state.name}" could not be created.`,
                description: jsxErrorMessage(status, statusText),
              }),
              saving: false,
            });
          }
        });
    });
  };
}

export default withRouter(RoleCreate);
