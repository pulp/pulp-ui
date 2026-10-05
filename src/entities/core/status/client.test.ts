import type { StatusResponse } from '@pulp-ui/sdk/core/models/status/status-response.zod';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { StatusClient } from './client';

describe('Integration: StatusClient', { tags: ['integration'] }, () => {
  const server = setupServer();

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const base = {
    versions: [
      {
        component: 'core',
        version: '3.112.0',
        package: 'pulpcore',
        module: 'pulpcore.app',
        domain_compatible: true,
      },
    ],
    online_workers: [{}],
    online_api_apps: [],
    online_content_apps: [],
    database_connection: { connected: true },
    redis_connection: { connected: true },
    content_settings: { content_path_prefix: '/pilp/content' },
    domain_enabled: false,
  } satisfies StatusResponse;

  it('retrieves and decodes the current status', async () => {
    server.use(http.get('/pulp/api/v3/status/', () => HttpResponse.json(base)));

    await expect(StatusClient.retrieve()).resolves.toStrictEqual({
      versions: [{ component: 'core', version: '3.112.0' }],
      isDatabaseConnected: true,
      onlineWorkerCount: 1,
      isRedisConnected: true,
    });
  });

  it('rejects with the status on a non-2xx response', async () => {
    server.use(
      http.get('/pulp/api/v3/status/', () =>
        HttpResponse.json({ detail: 'Service unavailable' }, { status: 503 }),
      ),
    );

    await expect(StatusClient.retrieve()).rejects.toMatchObject({
      status: 503,
    });
  });

  it('rejects when a 2xx response does not match the status shape', async () => {
    server.use(
      http.get('/pulp/api/v3/status/', () =>
        HttpResponse.json({ versions: 'not-an-array' }),
      ),
    );

    await expect(StatusClient.retrieve()).rejects.toThrow(/expected array/);
  });
});
