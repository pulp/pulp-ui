import { isAxiosError } from 'axios';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import {
  createAndWaitForResource,
  extractIdentifierFromPrn,
  testAxiosClient,
  testPulpAPI,
} from '../../test-utils/integration-client.ts';
import {
  type RPMPublicationType,
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
});
