import { t } from '@lingui/macro';
import { useState } from 'react';
import { Navigate } from 'react-router';
import { UserAPI, type UserType } from 'src/api';
import { UserFormPage } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import {
  type ErrorMessagesType,
  type RouteProps,
  mapErrorMessages,
  withRouter,
} from 'src/utilities';

function UserCreate(_props: RouteProps) {
  const [errorMessages, setErrorMessages] = useState<ErrorMessagesType>({});
  const [redirect, setRedirect] = useState<string>();
  const [user, setUser] = useState<UserType>({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    groups: [],
  });

  const saveUser = () =>
    UserAPI.create(user)
      .then(() => setRedirect(formatPath(Paths.core.user.list)))
      .catch((err) => setErrorMessages(mapErrorMessages(err)));

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const breadcrumbs = [
    { url: formatPath(Paths.core.user.list), name: t`Users` },
    { name: t`Create new user` },
  ];
  const title = t`Create new user`;

  return (
    <UserFormPage
      breadcrumbs={breadcrumbs}
      errorMessages={errorMessages}
      isNewUser
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

export default withRouter(UserCreate);
