import { isAxiosError } from 'axios';
import assert from 'node:assert/strict';
import { after, afterEach, before, describe, it } from 'node:test';
import {
  extractIdentifierFromPrn,
  testAxiosClient,
  testPulpAPI,
} from '../../test-utils/integration-client.ts';
import { type RPMRemoteType, createRemoteAPI } from './remote.ts';

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

  describe('RPM Remote - create()', () => {
    const testRpmRemoteUrl = 'https://example.com/repo/';
    let remoteHref: string | undefined;

    afterEach(async () => {
      if (remoteHref) {
        await testAxiosClient(remoteHref, { method: 'DELETE' });
        remoteHref = undefined;
      }
    });

    it('create() when giving only the required fields returns the created remote with server default', async () => {
      const testRpmRemoteName = 'test-rpm-remote-existent-create-minimal';
      const client = createRemoteAPI(testPulpAPI());

      const res = await client.create({
        name: testRpmRemoteName,
        url: testRpmRemoteUrl,
      });
      assert.notStrictEqual(res.data.pulp_href, undefined);
      remoteHref = res.data.pulp_href;

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.name, testRpmRemoteName);
      assert.strictEqual(res.data.url, testRpmRemoteUrl);
      assert.strictEqual(res.data.policy, 'immediate');
    });

    it('create() when giving additional optional fields returns them back on the created remote', async () => {
      const testRpmRemoteName = 'test-rpm-remote-existent-create';
      const client = createRemoteAPI(testPulpAPI());
      const payload = {
        name: testRpmRemoteName,
        url: testRpmRemoteUrl,
        policy: 'on_demand',
        tls_validation: false,
        download_concurrency: 5,
        sles_auth_token: 'test-token-123',
      } satisfies RPMRemoteType;

      const res = await client.create(payload);
      assert.notStrictEqual(res.data.pulp_href, undefined);
      remoteHref = res.data.pulp_href;

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.name, payload.name);
      assert.strictEqual(res.data.url, payload.url);
      assert.strictEqual(res.data.policy, payload.policy);
      assert.strictEqual(res.data.tls_validation, payload.tls_validation);
      assert.strictEqual(
        res.data.download_concurrency,
        payload.download_concurrency,
      );
      assert.strictEqual(res.data.sles_auth_token, payload.sles_auth_token);
    });

    it('create() when passed a duplicate name returns 400', async () => {
      const testRpmRemoteName = 'test-rpm-existent-create-duplicate';
      const client = createRemoteAPI(testPulpAPI());
      const payload = {
        name: testRpmRemoteName,
        url: testRpmRemoteUrl,
      } satisfies RPMRemoteType;

      const res = await client.create(payload);
      assert.notStrictEqual(res.data.pulp_href, undefined);
      remoteHref = res.data.pulp_href;

      await assert.rejects(
        () => client.create(payload),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    it('create() when missing the required name field returns 400', async () => {
      const client = createRemoteAPI(testPulpAPI());

      await assert.rejects(
        () => client.create({} as RPMRemoteType),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    it('create() when missing the required url field returns 400', async () => {
      const testRpmRemoteName = 'test-rpm-remote-create-missing-url';
      const client = createRemoteAPI(testPulpAPI());

      await assert.rejects(
        () => client.create({ name: testRpmRemoteName } as RPMRemoteType),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    it('create() when an invalid url schema is passed returns 400', async () => {
      const testRpmRemoteName = 'test-rpm-remote-create-invalid-url';
      const testRpmRemoteInvalidUrl = 'ftp://example.com/repo/';
      const client = createRemoteAPI(testPulpAPI());
      const payload = {
        name: testRpmRemoteName,
        url: testRpmRemoteInvalidUrl,
      } satisfies RPMRemoteType;

      await assert.rejects(
        () => client.create(payload),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    // NOTE: Verifying if this is expected allowed behaviour for credentials
    // TODO: Confirm with Pulp Developers
    it.skip('create() when the url contains embedded credentials returns 400', async () => {
      const testRpmRemoteName = 'test-rpm-remote-create-invalid-url';
      const testRpmRemoteInvalidUrl =
        'https://username:password@example.com/repo/';
      const client = createRemoteAPI(testPulpAPI());
      const payload = {
        name: testRpmRemoteName,
        url: testRpmRemoteInvalidUrl,
      } satisfies RPMRemoteType;

      await assert.rejects(
        () => client.create(payload),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });
  });
});
