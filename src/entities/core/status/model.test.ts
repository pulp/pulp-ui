import type { StatusResponse } from '@pulp-ui/sdk/core/models/status/status-response.zod';
import { describe, expect, it } from 'vitest';
import { statusCodec } from './model';

describe('Unit: status model', { tags: ['unit'] }, () => {
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
    online_workers: [],
    online_api_apps: [],
    online_content_apps: [],
    database_connection: { connected: true },
    content_settings: { content_path_prefix: '/pilp/content' },
    domain_enabled: false,
  } satisfies StatusResponse;

  it('decodes a fully healthy status with Redis configured', () => {
    const result = statusCodec.decode({
      ...base,
      online_workers: [{}, {}],
      redis_connection: { connected: true },
    });

    expect(result).toStrictEqual({
      versions: [{ component: 'core', version: '3.112.0' }],
      isDatabaseConnected: true,
      onlineWorkerCount: 2,
      isRedisConnected: true,
    });
  });

  it('decodes isRedisConnected as null when Redis is not configured', () => {
    expect(statusCodec.decode(base).isRedisConnected).toBeNull();
  });

  it('decodes isRedisConnected as dalse when Redisis configured but down', () => {
    const result = statusCodec.decode({
      ...base,
      redis_connection: { connected: false },
    });

    expect(result.isRedisConnected).toStrictEqual(false);
  });

  it('decodes isDatabaseConnected as false whent he database is down', () => {
    const result = statusCodec.decode({
      ...base,
      database_connection: { connected: false },
    });

    expect(result.isDatabaseConnected).toStrictEqual(false);
  });

  it('throw on encode (read-only)', () => {
    expect(() =>
      statusCodec.encode({
        versions: [],
        isDatabaseConnected: true,
        onlineWorkerCount: 0,
        isRedisConnected: null,
      }),
    ).toThrow('Status is read-only');
  });

  it('throws when the wire response failed validation', () => {
    expect(() =>
      statusCodec.decode({
        ...base,
        versions: 'not-an-array' as unknown as StatusResponse['versions'],
      }),
    ).toThrow();
  });
});
