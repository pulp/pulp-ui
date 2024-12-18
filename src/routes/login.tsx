import { t } from '@lingui/core/macro';
import { LoginPage } from '@patternfly/react-core';
import Cookies from 'js-cookie';
import { useState } from 'react';
import {
  data,
  replace,
  useActionData,
  useRouteLoaderData,
  useSubmit,
} from 'react-router';
import { LoginForm } from 'src/components';
import PulpLogo from 'static/images/pulp_logo.png';

export default function Login() {
  const { username: current_username } = useRouteLoaderData('root');
  const actionData = useActionData();
  const helperText = actionData
    ? t`Authentication failed` + ': ' + actionData.error
    : '';
  const submit = useSubmit();

  const [username, setUsername] = useState(current_username || '');
  const [password, setPassword] = useState('');

  const login = (ev) => {
    ev.preventDefault();
    submit(
      { username, password },
      { method: 'post' },
    );
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

  // TODO Don't use hardcoded paths.
  // TODO Look into using axios/pulp_api instead of plain fetch.
  const method = request.method.toLowerCase();
  const body = await request.formData();
  const username = body.get('username');
  const password = body.get('password');

  const searchParams = new URL(request.url).searchParams;
  const next = searchParams.get('next');

  if (method == 'post') {
    const response = await fetch('/pulp/api/v3/login/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(`${username}:${password}`),
        'X-CSRFToken': Cookies.get('csrftoken'),
        'X-Request-With': 'XMLHttpRequest',
      },
      credentials: 'same-origin',
    });
    if (response.status == 401) {
      return { error: (await response.json()).detail };
    }
    if (!response.ok) {
      throw data(await response.json(), { status: response.status });
    }
    return replace(next || '/status/');
  } else if (method == 'delete') {
    const response = await fetch('/pulp/api/v3/login/', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
        'X-Request-With': 'XMLHttpRequest',
      },
      credentials: 'same-origin',
    });
    if (!response.ok) {
      throw data(await response.json(), { status: response.status });
    }
    return replace('/status/');
  } else {
    throw data('Method not allowed.', { status: 405 });
  }
};
