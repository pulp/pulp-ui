import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { PulpAPI } from 'src/api/pulp';
import { createRepositoryAPI } from './repository.ts';

const baseUrl: string =
  process.env.PULP_BASE_URL ?? 'http://localhost:8080/pulp/api/v3/';
const testUsername: string = process.env.PULP_USERNAME ?? 'admin';
const testPassword: string = process.env.PULP_PASSWORD ?? 'admin';
const authorization: string =
  'Basic ' + Buffer.from(`${testUsername}:${testPassword}`).toString('base64');

async function testFetch(
  path: string,
  init: RequestInit = {},
): Promise<unknown> {
  const url: URL = new URL(path, baseUrl);
  const res: Response = await fetch(url, {
    ...init,
    headers: {
      authorization,
      'content-type': 'application/json',
      ...init.headers,
    },
  });

  return res.json();
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

function testClient(): PulpAPI {
  return {
    list: (url: string, params?: Record<string, unknown>) =>
      testFetch(`${url}${buildQueryParams(params)}`).then((data) => ({ data })),
  } as unknown as PulpAPI;
}

describe('Integration: RPM Repository API Client', () => {
  let createdHref: string;

  before(async () => {
    const repo = await testFetch('repositories/rpm/rpm/', {
      method: 'POST',
      body: JSON.stringify({ name: 'test-rpm-repo-existent' }),
    });
    // @ts-ignore
    createdHref = repo.pulp_href;

    if (!createdHref) {
        throw new Error()
    }
  });

  after(async () => {
    await testFetch(createdHref, {
      method: 'DELETE',
    });
  });

  it('list() finds the created repository by exact name', async () => {
    const client = createRepositoryAPI(testClient());

    const res = await client.list({ name: 'test-rpm-repo-existent' });

    assert.strictEqual(res.data.count, 1);
    assert.strictEqual(res.data.count, res.data.results.length);
    assert.strictEqual(res.data.results[0].name, 'test-rpm-repo-existent');
    assert.strictEqual(res.data.results[0].pulp_href, createdHref);
  });

  it('list() when passed a non-existent repository name returns empty results array', async () => {
    const client = createRepositoryAPI(testClient());

    const res = await client.list({ name: 'test-rpm-repo-non-existent' });

    assert.strictEqual(res.data.count, 0);
    assert.strictEqual(res.data.count, res.data.results.length);
  });
});
