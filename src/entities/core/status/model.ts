import { StatusResponse } from '@pulp-ui/sdk/core/models/status/status-response.zod';
import { z } from 'zod';

const statusDomainSchema = z.object({
  versions: z.array(z.object({ component: z.string(), version: z.string() })),
  isDatabaseConnected: z.boolean(),
  onlineWorkerCount: z.number(),
  isRedisConnected: z.boolean().nullable(),
});

type Status = z.infer<typeof statusDomainSchema>;

const statusCodec = z.codec(StatusResponse, statusDomainSchema, {
  decode: (status) => ({
    versions: status.versions.map(({ component, version }) => ({
      component,
      version,
    })),
    isDatabaseConnected: status.database_connection.connected,
    onlineWorkerCount: status.online_workers.length,
    isRedisConnected: status.redis_connection
      ? status.redis_connection.connected
      : null,
  }),
  encode: () => {
    throw new Error('Status is read-only; encode is not supported.');
  },
});

export { statusCodec };
export type { Status };
