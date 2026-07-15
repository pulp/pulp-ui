import { isAxiosError } from 'axios';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import {
  extractIdentifierFromPrn,
  testAxiosClient,
  testPulpAPI,
} from '../../test-utils/integration-client.ts';
import { createRemoteAPI } from './remote.ts';

describe('Integration: RPM Remote API Client', () => {
  describe('RPM Remote - list()', () => {
    const testRpmRemoteName = 'test-rpm-remote-existent-list';
    const testRpmRemoteUrl = 'https://example.com/repo/';
    let remoteHref: string | undefined;

    before(async () => {
      const res = await testAxiosClient('remotes/rpm/rpm/', {
        method: 'POST',
        data: JSON.stringify({
          name: testRpmRemoteName,
          url: testRpmRemoteUrl,
        }),
      });

      if (!res.data.pulp_href) {
        throw new Error('Failed to create test remote');
      }

      remoteHref = res.data.pulp_href;
    });

    after(async () => {
      await testAxiosClient(remoteHref, { method: 'DELETE' });
      remoteHref = undefined;
    });

    it('list() finds the created remote by exact name', async () => {
      const client = createRemoteAPI(testPulpAPI());

      const res = await client.list({ name: testRpmRemoteName });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.count, 1);
      assert.strictEqual(res.data.count, res.data.results.length);
      assert.strictEqual(res.data.results[0].name, testRpmRemoteName);
      assert.strictEqual(res.data.results[0].pulp_href, remoteHref);
      assert.strictEqual(res.data.results[0].url, testRpmRemoteUrl);
    });

    it('list() when passed a non-existent remote name returns empty result', async () => {
      const nonExistentRemoteName = 'test-rpm-remote-non-existent-list';
      const client = createRemoteAPI(testPulpAPI());

      const res = await client.list({ name: nonExistentRemoteName });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.count, 0);
      assert.strictEqual(res.data.count, 0);
      assert.strictEqual(res.data.count, res.data.results.length);
    });
  });

  describe('RPM Remote - retrieve()', () => {
    const testRpmRemoteName = 'test-rpm-remote-existent-retrieve';
    const testRpmRemoteUrl = 'https://example.com/repo/';
    let remotePrn: string | undefined;
    let remoteHref: string | undefined;

    before(async () => {
      const res = await testAxiosClient('remotes/rpm/rpm/', {
        method: 'POST',
        data: JSON.stringify({
          name: testRpmRemoteName,
          url: testRpmRemoteUrl,
        }),
      });

      if (!res.data.prn || !res.data.pulp_href) {
        throw new Error('Failed to create test remote');
      }

      remotePrn = res.data.prn;
      remoteHref = res.data.pulp_href;
    });

    after(async () => {
      await testAxiosClient(remoteHref, { method: 'DELETE' });
      remotePrn = undefined;
      remoteHref = undefined;
    });

    it('retrieve() whe passed correct identifier returns expected remote', async () => {
      const remoteIdentifier = extractIdentifierFromPrn(remotePrn);
      const client = createRemoteAPI(testPulpAPI());

      const res = await client.retrieve(remoteIdentifier);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.prn, remotePrn);
      assert.strictEqual(res.data.name, testRpmRemoteName);
      assert.strictEqual(res.data.url, testRpmRemoteUrl);
    });

    it('retrieve() when passed a non-existent identifier returns 404', async () => {
      const nonExistentRemoteIdentifier = '1234567890';
      const client = createRemoteAPI(testPulpAPI());

      await assert.rejects(
        () => client.retrieve(nonExistentRemoteIdentifier),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 404);
          return true;
        },
      );
    });
  });
});
