import { isAxiosError } from 'axios';
import assert from 'node:assert/strict';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';
import {
  testAxiosClient,
  testPulpAPI,
} from '../../test-utils/integration-client.ts';
import {
  type RPMRepositoryType,
  type RPMRepositoryUpsertType,
  createRepositoryAPI,
} from './repository.ts';

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
      if (!res.data.pulp_href) {
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
      if (!res.data.prn || !res.data.pulp_href) {
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

  describe('RPM Repository - create()', () => {
    let repositoryHref: string | undefined;

    afterEach(async () => {
      if (repositoryHref) {
        await testAxiosClient(repositoryHref, { method: 'DELETE' });
        repositoryHref = undefined;
      }
    });

    it('create() when giving only the repository name returns with the created repository defaults', async () => {
      const testRpmRepoName = 'test-rpm-repo-existent-create-minimal';
      const client = createRepositoryAPI(testPulpAPI());

      const res = await client.create({ name: testRpmRepoName });
      assert.notStrictEqual(res.data.pulp_href, undefined);
      repositoryHref = res.data.pulp_href;

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.name, testRpmRepoName);
      assert.strictEqual(res.data.autopublish, false);
      assert.strictEqual(res.data.retain_package_versions, 0);
      assert.strictEqual(res.data.checksum_type, null);
    });

    it('create() when giving additional data fields from required returns them back on created repository', async () => {
      const testRpmRepoName = 'test-rpm-existent-create-full';
      const client = createRepositoryAPI(testPulpAPI());
      const payload = {
        name: testRpmRepoName,
        autopublish: true,
        retain_package_versions: 3,
        checksum_type: 'sha256',
        description: 'This is a test description',
      } satisfies RPMRepositoryType;

      const res = await client.create(payload);
      assert.notStrictEqual(res.data.pulp_href, repositoryHref);
      repositoryHref = res.data.pulp_href;

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.autopublish, true);
      assert.strictEqual(res.data.name, testRpmRepoName);
      assert.strictEqual(res.data.retain_package_versions, 3);
      assert.strictEqual(res.data.checksum_type, 'sha256');
      assert.strictEqual(res.data.description, 'This is a test description');
    });

    it('create() when passed with a duplicate name returns 400', async () => {
      const testRpmRepoName = 'test-rpm-existent-create-duplicate';
      const client = createRepositoryAPI(testPulpAPI());

      const res = await client.create({ name: testRpmRepoName });
      assert.notStrictEqual(res.data.pulp_href, undefined);
      repositoryHref = res.data.pulp_href;

      await assert.rejects(
        () => client.create({ name: testRpmRepoName }),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    it('create() when missing the required name field returns 400', async () => {
      const client = createRepositoryAPI(testPulpAPI());

      await assert.rejects(
        () => client.create({} as RPMRepositoryUpsertType),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    it('create() when an invalid field is passed returns 400', async () => {
      const testRpmRepoName = 'test-rpm-existent-create-duplicate';
      const client = createRepositoryAPI(testPulpAPI());
      const invalidPayload = {
        name: testRpmRepoName,
        compression_type:
          'I am a test' as RPMRepositoryUpsertType['compression_type'],
      };

      await assert.rejects(
        () => client.create(invalidPayload),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    it('create() when a not allowed checksum_type is passed returns 400', async () => {
      const testRpmRepoName = 'test-rpm-existent-create-duplicate';
      const client = createRepositoryAPI(testPulpAPI());
      const invalidPayload = {
        name: testRpmRepoName,
        checksum_type: 'md5' as RPMRepositoryUpsertType['checksum_type'],
      };

      await assert.rejects(
        () => client.create(invalidPayload),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });
  });

  describe('RPM Repository - update()', () => {
    let repositoryHref: string | undefined;
    let repositoryPrn: string | undefined;

    beforeEach(async () => {
      const res = await testAxiosClient('repositories/rpm/rpm/', {
        method: 'POST',
        data: JSON.stringify({ name: 'test-rpm-repo-update' }),
      });

      // TODO: Update Error Message and Error Check
      if (!res.data.prn || !res.data.pulp_href) {
        throw new Error();
      }

      repositoryHref = res.data.pulp_href;
      repositoryPrn = res.data.prn;
    });

    afterEach(async () => {
      await testAxiosClient(repositoryHref, { method: 'DELETE' });
      repositoryHref = undefined;
      repositoryPrn = undefined;
    });

    it('update() with a single changed field updates only that field', async () => {
      const repositoryIdentifier = repositoryPrn.split(':', 3)[2];
      assert.strictEqual(typeof repositoryIdentifier, 'string');
      const client = createRepositoryAPI(testPulpAPI());

      const res = await client.update(repositoryIdentifier, {
        description: 'Updated description',
      });
      const expected = await client.retrieve(repositoryIdentifier);

      assert.strictEqual(res.status, 202);
      assert.strictEqual(expected.data.description, 'Updated description');
    });

    it('update() with multiple changed fields updates all associated', async () => {
      const repositoryIdentifier = repositoryPrn.split(':', 3)[2];
      assert.strictEqual(typeof repositoryPrn, 'string');
      const client = createRepositoryAPI(testPulpAPI());
      const payload = {
        autopublish: true,
        retain_package_versions: 5,
        checksum_type: 'sha256',
        compression_type: 'zstd',
      } satisfies Partial<RPMRepositoryUpsertType>;

      const res = await client.update(repositoryIdentifier, payload);
      const actual = await client.retrieve(repositoryIdentifier);

      assert.strictEqual(res.status, 202);
      assert.strictEqual(actual.data.autopublish, true);
      assert.strictEqual(actual.data.retain_package_versions, 5);
      assert.strictEqual(actual.data.checksum_type, 'sha256');
      assert.strictEqual(actual.data.compression_type, 'zstd');
    });

    it('update() when a not allowed checksum_type is passed returns 400', async () => {
      const repositoryIdentifier = repositoryPrn.split(':', 3)[2];
      assert.strictEqual(typeof repositoryPrn, 'string');
      const client = createRepositoryAPI(testPulpAPI());
      const invalidPayload = {
        checksum_type: 'sha1' as RPMRepositoryUpsertType['checksum_type'],
      };

      await assert.rejects(
        () => client.update(repositoryIdentifier, invalidPayload),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    it('update() when passed a non-existent identifier returns 404', async () => {
      const nonExistentRepositoryIdentifier = '1234567890';
      const client = createRepositoryAPI(testPulpAPI());

      await assert.rejects(
        () =>
          client.update(nonExistentRepositoryIdentifier, {
            description: 'This will not update',
          }),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 404);
          return true;
        },
      );
    });
  });
});
