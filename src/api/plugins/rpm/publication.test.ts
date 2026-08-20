import { isAxiosError } from 'axios';
import assert from 'node:assert/strict';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';
import {
  createAndWaitForResource,
  extractIdentifierFromPrn,
  testAxiosClient,
  testPulpAPI,
  waitForTaskCompletion,
} from '../../test-utils/integration-client.ts';
import {
  type RPMPublicationType,
  type RPMPublicationUpsertType,
  createPublicationAPI,
} from './publication.ts';
import type { RPMRepositoryType } from './repository.ts';

describe('Integration: RPM Publication API Client', () => {
  describe('RPM Publication - list()', () => {
    const testRpmRepositoryName = 'test-rpm-repository-publication-list';
    let repositoryHref: string | undefined;
    let publicationHref: string | undefined;

    before(async () => {
      const repo = await createAndWaitForResource<RPMRepositoryType>(
        'repositories/rpm/rpm/',
        {
          name: testRpmRepositoryName,
        },
      );
      repositoryHref = repo.pulp_href;

      const pub = await createAndWaitForResource<RPMPublicationType>(
        'publications/rpm/rpm/',
        { repository: repositoryHref },
      );
      publicationHref = pub.pulp_href;
    });

    after(async () => {
      await testAxiosClient(publicationHref, { method: 'DELETE' });
      await testAxiosClient(repositoryHref, { method: 'DELETE' });
      publicationHref = undefined;
      repositoryHref = undefined;
    });

    it('list() finds the created publication by repository', async () => {
      const client = createPublicationAPI(testPulpAPI());

      const res = await client.list({ repository: repositoryHref });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.count, 1);
      assert.strictEqual(res.data.count, res.data.results.length);
      assert.strictEqual(res.data.results[0].pulp_href, publicationHref);
    });

    it('list() when passed a non-existent repository returns 400', async () => {
      const nonExistentRepositoryHref =
        'http://localhost:8080/pulp/api/v3/repositories/rpm/rpm/01a01966-4c52-7b2e-99fc-5de89da79075/';
      const client = createPublicationAPI(testPulpAPI());

      await assert.rejects(
        () => client.list({ repository: nonExistentRepositoryHref }),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });
  });

  describe('RPM Publication - retrieve()', () => {
    const testRpmRepositoryName = 'test-rpm-repository-publication-retrieve';
    let repositoryHref: string | undefined;
    let publicationHref: string | undefined;
    let publicationPrn: string | undefined;

    before(async () => {
      const repo = await createAndWaitForResource<RPMRepositoryType>(
        'repositories/rpm/rpm/',
        {
          name: testRpmRepositoryName,
        },
      );
      repositoryHref = repo.pulp_href;

      const pub = await createAndWaitForResource<RPMPublicationType>(
        'publications/rpm/rpm/',
        {
          repository: repositoryHref,
        },
      );
      publicationHref = pub.pulp_href;
      publicationPrn = pub.prn;
    });

    after(async () => {
      await testAxiosClient(publicationHref, { method: 'DELETE' });
      await testAxiosClient(repositoryHref, { method: 'DELETE' });
      publicationHref = undefined;
      publicationPrn = undefined;
      repositoryHref = undefined;
    });

    it('retrieve() when passed correct identifier returns expected publication', async () => {
      const client = createPublicationAPI(testPulpAPI());
      const publicationIdentifier = extractIdentifierFromPrn(publicationPrn);

      const res = await client.retrieve(publicationIdentifier);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.prn, publicationPrn);
      assert.strictEqual(res.data.repository, repositoryHref);
      assert.strictEqual(res.data.pulp_href, publicationHref);
    });

    it('retrieve() when passed a non-existent identifier returns 404', async () => {
      const nonExistentPublicationIdentifier = '1234567890';
      const client = createPublicationAPI(testPulpAPI());

      await assert.rejects(
        () => client.retrieve(nonExistentPublicationIdentifier),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 404);
          return true;
        },
      );
    });
  });

  describe('RPM Publication - create()', () => {
    let repositoryHref: string | undefined;
    let publicationHref: string | undefined;

    afterEach(async () => {
      if (publicationHref) {
        await testAxiosClient(publicationHref, { method: 'DELETE' });
        publicationHref = undefined;
      }

      if (repositoryHref) {
        await testAxiosClient(repositoryHref, { method: 'DELETE' });
        repositoryHref = undefined;
      }
    });

    it('create() when given only a repository dispatches task, and the publication exists on task completion', async () => {
      const testRpmRepositoryName =
        'test-rpm-repository-publication-create-repo';
      const repo = await createAndWaitForResource<RPMRepositoryType>(
        'repositories/rpm/rpm/',
        {
          name: testRpmRepositoryName,
        },
      );
      repositoryHref = repo.pulp_href;
      const client = createPublicationAPI(testPulpAPI());

      const res = await client.create({ repository: repositoryHref });

      assert.strictEqual(res.status, 202);
      assert.notStrictEqual(res.data.task, undefined);

      await waitForTaskCompletion(res.data.task);
      const task = await testAxiosClient(res.data.task, { method: 'GET' });
      publicationHref = task.data.created_resources?.[0];

      const created = await testAxiosClient(publicationHref, { method: 'GET' });
      assert.strictEqual(created.data.repository, repositoryHref);
      assert.strictEqual(created.data.pulp_href, publicationHref);
    });

    it('create() when given only a repository_version dispatches task, and publication exists on task completion', async () => {
      const testRpmRepositoryName =
        'test-rpm-repository-publication-create-version';
      const repo = await createAndWaitForResource<RPMRepositoryType>(
        'repositories/rpm/rpm/',
        {
          name: testRpmRepositoryName,
        },
      );
      repositoryHref = repo.pulp_href;
      const repositoryVersionHref = `${repositoryHref}versions/0/`;
      const client = createPublicationAPI(testPulpAPI());

      const res = await client.create({
        repository_version: repositoryVersionHref,
      });

      assert.strictEqual(res.status, 202);
      assert.notStrictEqual(res.data.task, undefined);

      await waitForTaskCompletion(res.data.task);
      const task = await testAxiosClient(res.data.task, { method: 'GET' });
      publicationHref = task.data.created_resources?.[0];

      const created = await testAxiosClient(publicationHref, { method: 'GET' });
      assert.strictEqual(
        created.data.repository_version,
        repositoryVersionHref,
      );
      assert.strictEqual(created.data.pulp_href, publicationHref);
    });

    it('create() when given additional optional fields dispatches task, and are shown on publication when task completes', async () => {
      const repo = await createAndWaitForResource<RPMRepositoryType>(
        'repositories/rpm/rpm/',
        { name: 'test-rpm-repository-publication-create-optional' },
      );
      repositoryHref = repo.pulp_href;
      const client = createPublicationAPI(testPulpAPI());
      const payload = {
        repository: repositoryHref,
        checksum_type: 'sha256',
        compression_type: 'gz',
        layout: 'flat',
      } satisfies RPMPublicationType;

      const res = await client.create(payload);

      assert.strictEqual(res.status, 202);
      assert.notStrictEqual(res.data.task, undefined);

      await waitForTaskCompletion(res.data.task);
      const task = await testAxiosClient(res.data.task, { method: 'GET' });
      publicationHref = task.data.created_resources?.[0];

      const created = await testAxiosClient(publicationHref, { method: 'GET' });
      assert.strictEqual(created.data.checksum_type, payload.checksum_type);
      assert.strictEqual(created.data.repository, payload.repository);
      assert.strictEqual(created.data.layout, payload.layout);
      assert.strictEqual(
        created.data.compression_type,
        payload.compression_type,
      );
    });

    it('create() with checkpoint and repository dispatches a task, and completes successfully', async () => {
      const repo = await createAndWaitForResource<RPMRepositoryType>(
        'repositories/rpm/rpm/',
        { name: 'test-rpm-repository-publication-create-checkpoint' },
      );
      repositoryHref = repo.pulp_href;
      const client = createPublicationAPI(testPulpAPI());

      const res = await client.create({
        repository: repositoryHref,
        checkpoint: true,
      });

      assert.strictEqual(res.status, 202);
      assert.notStrictEqual(res.data.task, undefined);

      await waitForTaskCompletion(res.data.task);
      const task = await testAxiosClient(res.data.task, { method: 'GET' });
      publicationHref = task.data.created_resources?.[0];

      const created = await testAxiosClient(publicationHref, { method: 'GET' });
      assert.strictEqual(created.data.checkpoint, true);
    });

    it('create() when checkpoint is passed with repository_version returns 400', async () => {
      const repo = await createAndWaitForResource<RPMRepositoryType>(
        'repositories/rpm/rpm/',
        { name: 'test-rpm-repository-publication-create-checkpoint-version' },
      );
      repositoryHref = repo.pulp_href;
      const repositoryVersionHref = `${repositoryHref}versions/0/`;
      const client = createPublicationAPI(testPulpAPI());

      await assert.rejects(
        () =>
          client.create({
            repository_version: repositoryVersionHref,
            checkpoint: true,
          }),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    it('create() when missing both repository and repository_version returns 400', async () => {
      const client = createPublicationAPI(testPulpAPI());

      await assert.rejects(
        () => client.create({}),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    it('create() when an invalid checksum_type is passed returns 400', async () => {
      const repo = await createAndWaitForResource<RPMRepositoryType>(
        'repositories/rpm/rpm/',
        { name: 'test-rpm-repository-publication-bad-checksum' },
      );
      repositoryHref = repo.pulp_href;
      const client = createPublicationAPI(testPulpAPI());

      await assert.rejects(
        () =>
          client.create({
            repository: repositoryHref,
            checksum_type: 'md5' as RPMPublicationUpsertType['checksum_type'],
          }),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });
  });

  describe('RPM Publication - delete()', () => {
    const testRpmRepositoryName = 'test-rpm-repository-publication-delete';
    let repositoryHref: string | undefined;
    let publicationHref: string | undefined;
    let publicationPrn: string | undefined;

    beforeEach(async () => {
      const repo = await createAndWaitForResource<RPMRepositoryType>(
        'repositories/rpm/rpm/',
        {
          name: testRpmRepositoryName,
        },
      );
      repositoryHref = repo.pulp_href;

      const pub = await createAndWaitForResource<RPMPublicationType>(
        'publications/rpm/rpm/',
        {
          repository: repositoryHref,
        },
      );
      publicationHref = pub.pulp_href;
      publicationPrn = pub.prn;
    });

    afterEach(async () => {
      if (publicationHref) {
        await testAxiosClient(publicationHref, { method: 'DELETE' });
      }

      await testAxiosClient(repositoryHref, { method: 'DELETE' });
      publicationHref = undefined;
      publicationPrn = undefined;
      repositoryHref = undefined;
    });

    it('delete() returns 204 and removes the publication', async () => {
      const client = createPublicationAPI(testPulpAPI());
      const publicationIdentifier = extractIdentifierFromPrn(publicationPrn);

      const res = await client.delete(publicationIdentifier);

      assert.strictEqual(res.status, 204);
      await assert.rejects(
        () => client.retrieve(publicationIdentifier),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 404);
          return true;
        },
      );

      publicationHref = undefined;
    });

    it('delete() when passed a non-existent identifier returns 404', async () => {
      const nonExistentPublicationIdentifier = '1234567890';
      const client = createPublicationAPI(testPulpAPI());

      await assert.rejects(
        () => client.delete(nonExistentPublicationIdentifier),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 404);
          return true;
        },
      );
    });
  });
});
