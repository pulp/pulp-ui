import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { PulpAPI } from '../pulp.ts';

const baseUrl: string =
  process.env.PULP_BASE_URL ?? 'http://localhost:8080/pulp/api/v3/';
const testUsername: string = process.env.PULP_USERNAME ?? 'admin';
const testPassword: string = process.env.PULP_PASSWORD ?? 'admin';
const authorization: string =
  'Basic ' + Buffer.from(`${testUsername}:${testPassword}`).toString('base64');

async function testAxiosClient(
  path: string,
  config: AxiosRequestConfig = {},
): Promise<AxiosResponse> {
  const url: string = new URL(path, baseUrl).toString();
  const axiosRequest = {
    ...config,
    url,
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
      ...config.headers,
    },
  } satisfies AxiosRequestConfig;
  const res = await axios.request(axiosRequest);

  return res;
}

function testPulpAPI(): PulpAPI {
  return {
    list: (url: string, params?: Record<string, unknown>) =>
      testAxiosClient(`${url}${buildQueryParams(params)}`, {
        method: 'GET',
      }),
    http: {
      get: (url: string, config: { params?: Record<string, unknown> }) =>
        testAxiosClient(`${url}${buildQueryParams(config?.params)}`, {
          method: 'GET',
        }),
      post: (url: string, data: unknown) =>
        testAxiosClient(url, { method: 'POST', data }),
      patch: (
        url: string,
        data: unknown,
        config: { params?: Record<string, unknown> },
      ) =>
        testAxiosClient(`${url}${buildQueryParams(config?.params)}`, {
          method: 'PATCH',
          data,
        }),
      delete: (url: string, config: { params?: Record<string, unknown> }) =>
        testAxiosClient(`${url}${buildQueryParams(config?.params)}`, {
          method: 'DELETE',
        }),
    },
  } as unknown as PulpAPI;
}

function buildQueryParams(params?: Record<string, unknown>): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) {
      search.set(key, String(value));
    }
  }

  const queryString = search.toString();
  return queryString ? `?${queryString}` : '';
}

async function waitForTaskCompletion(
  taskHref: string,
  {
    waitMs = 500,
    attemptsLeft = 10,
  }: { waitMs?: number; attemptsLeft?: number } = {},
): Promise<void> {
  const res = await testAxiosClient(taskHref, { method: 'GET' });
  const state: string = res.data.state;

  if (['skipped', 'failed', 'canceled'].includes(state)) {
    throw new Error(`Task ${taskHref} ended with state "${state}"`);
  }

  if (state === 'completed') {
    return;
  }

  if (attemptsLeft <= 0) {
    throw new Error(
      `Task ${taskHref} did not complete within the allowed attempts`,
    );
  }

  await new Promise((r) => setTimeout(r, waitMs));
  return waitForTaskCompletion(taskHref, {
    waitMs: Math.round(waitMs * 1.5),
    attemptsLeft: attemptsLeft - 1,
  });
}

export { testPulpAPI, testAxiosClient, waitForTaskCompletion };
