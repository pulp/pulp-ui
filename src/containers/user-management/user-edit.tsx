import { t } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAPI, type UserType } from 'src/api';
import {
  BaseHeader,
  EmptyStateUnauthorized,
  LoadingPage,
  UserFormPage,
} from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { useUserContext } from 'src/user-context';
import {
  type ErrorMessagesType,
  type RouteProps,
  mapErrorMessages,
  withRouter,
} from 'src/utilities';

function UserEdit(props: RouteProps) {
  const [errorMessages, setErrorMessages] = useState<ErrorMessagesType>({});
  const [initialState, setInitialState] = useState<UserType>();
  const [redirect, setRedirect] = useState<string>();
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>();

  const {
    credentials: { username },
    updateUsername,
    updatePassword,
  } = useUserContext();

  const id = props.routeParams.user_id;
  useEffect(() => {
    UserAPI.get(id)
      .then(({ data: result }) => {
        const extendedResult = { ...result, password: '' };
        setInitialState({ ...extendedResult });
        setUser(extendedResult);
        setUnauthorized(false);
      })
      .catch(() => setUnauthorized(true));
  }, [id]);

  const saveUser = () =>
    UserAPI.saveUser(user)
      .then(() => {
        // update saved credentials when password of logged user is changed
        if (initialState.username === username && user.password) {
          updatePassword(user.password);
        }
        if (initialState.username === username && username !== user.username) {
          updateUsername(user.username);
        }

        setRedirect(formatPath(Paths.core.user.list));
      })
      .catch((err) => setErrorMessages(mapErrorMessages(err)));

  if (redirect) {
    return <Navigate to={redirect} />;
  }

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
      breadcrumbs={breadcrumbs}
      errorMessages={errorMessages}
      onCancel={() => setRedirect(formatPath(Paths.core.user.list))}
      saveUser={saveUser}
      title={title}
      updateUser={(user, errorMessages) => {
        setErrorMessages(errorMessages);
        setUser(user);
      }}
      user={user}
    />
  );
}

export default withRouter(UserEdit);
