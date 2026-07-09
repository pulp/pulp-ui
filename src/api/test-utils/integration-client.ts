import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { type PulpAPI } from '../pulp';

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

export { testPulpAPI, testAxiosClient };
