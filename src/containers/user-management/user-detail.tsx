import { t } from '@lingui/macro';
import { Button } from '@patternfly/react-core';
import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserAPI, type UserType } from 'src/api';
import { AppContext, type IAppContextType } from 'src/app-context';
import {
  AlertList,
  type AlertType,
  DeleteUserModal,
  EmptyStateUnauthorized,
  LoadingPage,
  NotFound,
  UserFormPage,
  closeAlert,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  type ErrorMessagesType,
  type RouteProps,
  withRouter,
} from 'src/utilities';

interface IState {
  alerts: AlertType[];
  errorMessages: ErrorMessagesType;
  notFound: boolean;
  redirect?: string;
  showDeleteModal: boolean;
  unauthorized: boolean;
  userDetail: UserType;
}

class UserDetail extends Component<RouteProps, IState> {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      alerts: [],
      errorMessages: {},
      notFound: false,
      showDeleteModal: false,
      unauthorized: false,
      userDetail: undefined,
    };
  }

  componentDidMount() {
    const { hasPermission, user } = this.context as IAppContextType;
    const id = this.props.routeParams.user_id;
    if (!user || user.is_anonymous || !hasPermission('galaxy.view_user')) {
      this.setState({ unauthorized: true });
    } else {
      UserAPI.get(id)
        .then((result) => this.setState({ userDetail: result.data }))
        .catch(() => this.setState({ notFound: true }));
    }
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    const {
      alerts,
      errorMessages,
      notFound,
      showDeleteModal,
      unauthorized,
      userDetail,
    } = this.state;

    const { user, hasPermission } = this.context as IAppContextType;

    if (unauthorized) {
      return <EmptyStateUnauthorized />;
    }

    if (notFound) {
      return <NotFound />;
    }

    if (!userDetail) {
      return <LoadingPage />;
    }

    const breadcrumbs = [
      { url: formatPath(Paths.core.user.list), name: t`Users` },
      { name: userDetail.username },
    ];
    const title = t`User details`;

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
        <DeleteUserModal
          isOpen={showDeleteModal}
          closeModal={this.closeModal}
          user={userDetail}
          addAlert={(text, variant, description = undefined) =>
            this.setState({
              alerts: alerts.concat([
                { title: text, variant: variant, description: description },
              ]),
            })
          }
        />
        <UserFormPage
          user={userDetail}
          breadcrumbs={breadcrumbs}
          title={title}
          errorMessages={errorMessages}
          updateUser={(user) => this.setState({ userDetail: user })}
          isReadonly
          extraControls={
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {!!user && hasPermission('galaxy.change_user') ? (
                <div>
                  <Link
                    to={formatPath(Paths.core.user.edit, {
                      user_id: userDetail.id,
                    })}
                  >
                    <Button>{t`Edit`}</Button>
                  </Link>
                </div>
              ) : null}
              {!!user && hasPermission('galaxy.delete_user') ? (
                <div style={{ marginLeft: '8px' }}>
                  <Button
                    variant='secondary'
                    onClick={() => this.setState({ showDeleteModal: true })}
                  >
                    {t`Delete`}
                  </Button>
                </div>
              ) : null}
            </div>
          }
        />
      </>
    );
  }

  private closeModal = (didDelete) =>
    this.setState(
      {
        showDeleteModal: false,
      },
      () => {
        if (didDelete) {
          this.setState({ redirect: formatPath(Paths.core.user.list) });
        }
      },
    );
}

export default withRouter(UserDetail);
