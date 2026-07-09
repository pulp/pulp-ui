import { isAxiosError } from 'axios';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import {
  testAxiosClient,
  testPulpAPI,
} from 'src/api/test-utils/integration-client.ts';
import { createRepositoryAPI } from './repository.ts';

describe('Integration: RPM Repository API Client', () => {
  describe('RPM Repository - list()', () => {
    const testRpmRepoName = 'test-rpm-repo-existent-list';
    let repositoryHref: string;

    before(async () => {
      const res = await testAxiosClient('repositories/rpm/rpm/', {
        method: 'POST',
        data: JSON.stringify({ name: testRpmRepoName }),
      });

      // TODO: Update Error Message and Error Check
      if (res.status === 500 || !res.data.pulp_href) {
        throw new Error();
      }

      repositoryHref = res.data.pulp_href;
    });

    after(async () => {
      await testAxiosClient(repositoryHref, { method: 'DELETE' });
    });

    it('list() find the created repository by exact name', async () => {
      const client = createRepositoryAPI(testPulpAPI());

      const res = await client.list({ name: testRpmRepoName });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.count, 1);
      assert.strictEqual(res.data.count, res.data.results.length);
      assert.strictEqual(res.data.results[0].name, testRpmRepoName);
      assert.strictEqual(res.data.results[0].pulp_href, repositoryHref);
    });

    it('list() when passed a non-existent repository name returns empty result', async () => {
      const nonExistentRepositoryName = 'test-rpm-repo-non-existent-list';
      const client = createRepositoryAPI(testPulpAPI());

      const res = await client.list({ name: nonExistentRepositoryName });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.count, 0);
      assert.strictEqual(res.data.results.length, 0);
      assert.strictEqual(res.data.count, res.data.results.length);
    });
  });

  describe('RPM Repository - retrieve()', () => {
    const testRpmRepoName = 'test-rpm-repo-existent-retrieve';
    let repositoryPrn: string;
    let repositoryHref: string;

    before(async () => {
      const res = await testAxiosClient('repositories/rpm/rpm/', {
        method: 'POST',
        data: JSON.stringify({ name: testRpmRepoName }),
      });

      // TODO: Update Error Message and Error Check
      if (res.status === 500 || !res.data.prn) {
        throw new Error();
      }

      repositoryPrn = res.data.prn;
      repositoryHref = res.data.pulp_href;
    });

    after(async () => {
      await testAxiosClient(repositoryHref, { method: 'DELETE' });
    });

    it('retrieve() when passed correct identifier returns expected repository', async () => {
      const repositoryIdentifier = repositoryPrn.split(':', 3)[2];
      assert.strictEqual(typeof repositoryIdentifier, 'string');

      const client = createRepositoryAPI(testPulpAPI());

      const res = await client.retrieve(repositoryIdentifier);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.prn, repositoryPrn);
      assert.strictEqual(res.data.name, testRpmRepoName);
    });

    it('retrieve() when passed an non-existent identifier returns empty object', async () => {
      const nonExistentRepositoryIdentifier = '1234567890';

      const client = createRepositoryAPI(testPulpAPI());

      await assert.rejects(
        () => client.retrieve(nonExistentRepositoryIdentifier),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 404);
          return true;
        },
      );
    });
  });
});
