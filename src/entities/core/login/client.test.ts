import type { LoginResponse } from '@pulp-ui/sdk/core/models/login/login-response.zod';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { LoginClient } from './client';

describe('Integration: LoginClient', { tags: ['integration'] }, () => {
  const server = setupServer();

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const loginResponseBody = {
    pulp_href: 'https://exmaple.com/pulp/api/v3/users/4/',
    prn: 'prn:auth.user:4',
    username: 'admin',
  } satisfies LoginResponse;

  const basic = (user: string, pass: string): string =>
    `Basic ${Buffer.from(`${user}:${pass}`, 'utf-8').toString('base64')}`;

  it('retrieve decodes the current session user', async () => {
    server.use(
      http.get('/pulp/api/v3/login/', () =>
        HttpResponse.json(loginResponseBody),
      ),
    );

    await expect(LoginClient.retrieve()).resolves.toStrictEqual({
      href: loginResponseBody.pulp_href,
      prn: loginResponseBody.prn,
      username: loginResponseBody.username,
    });
  });

  it('login send the credentials as a UTF-8 Basic Auth header', async () => {
    let authorization: string | null = null;
    server.use(
      http.post('/pulp/api/v3/login/', ({ request }) => {
        authorization = request.headers.get('authorization');
        return HttpResponse.json(loginResponseBody, { status: 201 });
      }),
    );

    await LoginClient.login({ username: 'admin', password: 'password' });

    expect(authorization).toStrictEqual(basic('admin', 'password'));
  });

  it('login rejectrs with the status on invalid credentials', async () => {
    server.use(
      http.post('/pulp/api/v3/login/', () =>
        HttpResponse.json(
          { detail: 'Invalid username/password' },
          { status: 401 },
        ),
      ),
    );

    await expect(
      LoginClient.login({ username: 'admin', password: 'wrong' }),
    ).rejects.toMatchObject({ status: 401 });
  });

  it('login rejects when a 201 response is missing a required field', async () => {
    server.use(
      http.post('/pulp/api/v3/login/', () =>
        HttpResponse.json(
          {
            pulp_href: loginResponseBody.pulp_href,
            username: loginResponseBody.username,
          },
          { status: 201 },
        ),
      ),
    );

    await expect(
      LoginClient.login({ username: 'admin', password: 'password' }),
    ).rejects.toThrow();
  });
});
