import { statusRead } from '@pulp-ui/sdk/core/status';
import { type Status, statusCodec } from './model';

async function retrieve(): Promise<Status> {
  const data = await statusRead();
  return statusCodec.decode(data);
}

export const StatusClient = { retrieve };
