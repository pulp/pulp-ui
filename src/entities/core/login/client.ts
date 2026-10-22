import { loginRead, login as postLogin } from '@pulp-ui/sdk/core/login';
import {
  type Credentials,
  type Login,
  credentialsCodec,
  loginResponseCodec,
} from './model';

async function retrieve(): Promise<Login> {
  return loginResponseCodec.parse(await loginRead());
}

async function login(credentials: Credentials): Promise<Login> {
  const authorisation = credentialsCodec.encode(credentials);
  return loginResponseCodec.parse(
    await postLogin({ headers: { Authorization: authorisation } }),
  );
}

export const LoginClient = { retrieve, login };
