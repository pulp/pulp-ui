import { t } from '@lingui/macro';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAPI, type UserType } from 'src/api';
import { AppContext, type IAppContextType } from 'src/app-context';
import {
  BaseHeader,
  EmptyStateUnauthorized,
  LoadingPage,
  UserFormPage,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  type ErrorMessagesType,
  type RouteProps,
  mapErrorMessages,
  withRouter,
} from 'src/utilities';

interface IState {
  user: UserType;
  errorMessages: ErrorMessagesType;
  unauthorized: boolean;
  redirect?: string;
}

class UserEdit extends Component<RouteProps, IState> {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = { user: undefined, errorMessages: {}, unauthorized: false };
  }

  componentDidMount() {
    const id = this.props.routeParams.user_id;

    UserAPI.get(id)
      .then((result) =>
        this.setState({ user: result.data, unauthorized: false }),
      )
      .catch(() => this.setState({ unauthorized: true }));
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    const { user, errorMessages, unauthorized } = this.state;
    const title = t`Edit user`;

    if (unauthorized) {
      return (
        <>
          <BaseHeader title={title} />
          <EmptyStateUnauthorized />
        </>
      );
    }

    if (!user) {
      return <LoadingPage />;
    }

    const breadcrumbs = [
      { url: formatPath(Paths.core.user.list), name: t`Users` },
      {
        url: formatPath(Paths.core.user.detail, { user_id: user.id }),
        name: user.username,
      },
      { name: t`Edit` },
    ];

    return (
      <UserFormPage
        user={user}
        breadcrumbs={breadcrumbs}
        title={title}
        errorMessages={errorMessages}
        updateUser={(user, errorMessages) =>
          this.setState({ user: user, errorMessages: errorMessages })
        }
        saveUser={this.saveUser}
        onCancel={() =>
          this.setState({ redirect: formatPath(Paths.core.user.list) })
        }
      />
    );
  }
  private saveUser = () => {
    const { user } = this.state;
    UserAPI.update(user.id.toString(), user)
      .then(() => {
        // redirect to login page when password of logged user is changed
        // SSO not relevant, user-edit disabled
        if (
          (this.context as IAppContextType).user.id === user.id &&
          user.password
        ) {
          this.setState({ redirect: formatPath(Paths.meta.login) });
        } else {
          this.setState({ redirect: formatPath(Paths.core.user.list) });
        }
      })
      .catch((err) => {
        this.setState({ errorMessages: mapErrorMessages(err) });
      });
  };
}

export default withRouter(UserEdit);
