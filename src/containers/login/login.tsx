import { t } from '@lingui/core/macro';
import { LoginPage } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { PulpLoginAPI } from 'src/api';
import { FormFieldHelper, LoginForm } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { useUserContext } from 'src/user-context';
import { useQueryParams, withRouter } from 'src/utilities';
import PulpLogo from 'static/images/pulp_logo.png';

function PulpLoginPage(_props) {
  const { setCredentials, clearCredentials } = useUserContext();
  const { next } = useQueryParams();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState('');
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    clearCredentials();
  }, []);

  const onLoginClick = (e) => {
    PulpLoginAPI.try(username, password)
      .then(() => {
        // verified, save
        setCredentials(username, password, remember);
        setRedirect(
          next && next !== '/login/' ? next : formatPath(Paths.core.status),
        );
      })
      .catch((result) => {
        // didn't work
        if (result.response.status.toString().startsWith('5')) {
          setError(t`Server error. Please come back later.`);
        } else {
          setError(
            result.response.data?.detail || t`Invalid login credentials.`,
          );
        }
      });

    e.preventDefault();
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <LoginPage
      style={{
        backgroundColor: 'var(--pf-v5-global--BackgroundColor--dark-100)',
      }}
      loginTitle={t`Login`}
      brandImgSrc={PulpLogo}
    >
      <LoginForm
        helperText={
          <>
            {error ? (
              <span style={{ color: 'var(--pf-v5-global--danger-color--100)' }}>
                <ExclamationCircleIcon /> {error}
              </span>
            ) : null}
            <FormFieldHelper variant='warning'>
              {t`Pulp UI is currently using HTTP Basic Authentication. Your credentials will be stored in your browser's sessionStorage or localStorage, in plain text.`}
            </FormFieldHelper>
          </>
        }
        onChangePassword={(_e, value) => setPassword(value)}
        onChangeUsername={(_e, value) => setUsername(value)}
        onLoginButtonClick={onLoginClick}
        passwordValue={password}
        showHelperText
        usernameValue={username}
        rememberMeLabel='Keep credentials in localStorage.'
        isRememberMeChecked={remember}
        onChangeRememberMe={(_e, value) => setRemember(value)}
      />
    </LoginPage>
  );
}

export default withRouter(PulpLoginPage);
