import { t } from '@lingui/core/macro';
import { LoginPage } from '@patternfly/react-core';
import { useState } from 'react';
import {
  data,
  replace,
  useActionData,
  useSubmit,
} from 'react-router';
import { PulpLoginAPI } from 'src/api';
import { LoginForm } from 'src/components';
import PulpLogo from 'static/images/pulp_logo.png';

export default function Login() {
  const actionData = useActionData();
  const helperText = actionData
    ? t`Authentication failed` + ': ' + actionData.error
    : '';
  const submit = useSubmit();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = (ev) => {
    ev.preventDefault();
    submit({ username, password }, { method: 'post' });
  };

  return (
    <LoginPage
      style={{
        backgroundColor: 'var(--pf-v5-global--BackgroundColor--dark-100)',
      }}
      loginTitle={t`Login`}
      brandImgSrc={PulpLogo}
      brandImgAlt='Pulp'
    >
      <LoginForm
        onChangePassword={(_e, value) => setPassword(value)}
        onChangeUsername={(_e, value) => setUsername(value)}
        onLoginButtonClick={login}
        passwordValue={password}
        usernameValue={username}
        isLoginButtonDisabled={!username || !password}
        helperText={helperText}
        showHelperText={!!helperText}
        isValidUsername={!helperText}
        isValidPassword={!helperText}
      />
    </LoginPage>
  );
}

export const clientAction = async ({ request }) => {
  const method = request.method.toLowerCase();
  const body = await request.formData();
  const username = body.get('username');
  const password = body.get('password');

  const searchParams = new URL(request.url).searchParams;
  const next = searchParams.get('next');

  if (method == 'post') {
    await PulpLoginAPI.login(username, password);
    return replace(next || '/status/');
  } else if (method == 'delete') {
    await PulpLoginAPI.logout();
    return replace('/status/');
  } else {
    throw data('Method not allowed.', { status: 405 });
  }
};
