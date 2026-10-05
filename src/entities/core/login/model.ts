import { LoginResponse } from '@pulp-ui/sdk/core/models/login/login-response.zod';
import { z } from 'zod';

const loginDomainSchema = z.object({
  href: z.url(),
  prn: z.string(),
  username: z.string(),
});

const loginResponseRequired = LoginResponse.required({
  pulp_href: true,
  prn: true,
  username: true,
});

type Login = z.infer<typeof loginDomainSchema>;

const loginResponseCodec = z.codec(loginResponseRequired, loginDomainSchema, {
  decode: ({ pulp_href, prn, username }) => ({
    href: pulp_href,
    prn,
    username,
  }),
  encode: () => {
    throw new Error('LoginResponse is server-issued; encode is not supported.');
  },
});

const credentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type Credentials = z.infer<typeof credentialsSchema>;

const credentialsCodec = z.codec(z.string(), credentialsSchema, {
  decode: () => {
    throw new Error(
      'A Basic Auth header cannot be decoded back into user credentials.',
    );
  },
  encode: ({ username, password }) => {
    const bytes = new TextEncoder().encode(`${username}:${password}`);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return `Basic ${btoa(binary)}`;
  },
});

export { loginResponseCodec, credentialsCodec };
export type { Login, Credentials };
