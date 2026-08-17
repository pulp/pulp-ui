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
  type RPMDistributionType,
  createDistributionAPI,
} from './distribution.ts';

describe('Integration: RPM Distribution API Client', () => {
  describe('RPM Distribution - list()', () => {
    const testRpmDistributionName = 'test-rpm-distribution-existent-list';
    const testRpmDistributionBasePath = 'test-rpm-distribution-existent-list';
    let distributionHref: string | undefined;

    before(async () => {
      const created = await createAndWaitForResource<RPMDistributionType>(
        'distributions/rpm/rpm/',
        {
          name: testRpmDistributionName,
          base_path: testRpmDistributionBasePath,
        },
      );
      distributionHref = created.pulp_href;
    });

    after(async () => {
      await testAxiosClient(distributionHref, { method: 'DELETE' });
      distributionHref = undefined;
    });

    it('list() finds the created distribution by exact name', async () => {
      const client = createDistributionAPI(testPulpAPI());

      const res = await client.list({ name: testRpmDistributionName });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.count, 1);
      assert.strictEqual(res.data.count, res.data.results.length);
      assert.strictEqual(res.data.results[0].name, testRpmDistributionName);
      assert.strictEqual(res.data.results[0].pulp_href, distributionHref);
      assert.strictEqual(
        res.data.results[0].base_path,
        testRpmDistributionBasePath,
      );
    });

    it('list() when passed a non-existent distribution name returns empty result', async () => {
      const nonExistentDistributionName =
        'test-rpm-distribution-non-existent-list';
      const client = createDistributionAPI(testPulpAPI());

      const res = await client.list({ name: nonExistentDistributionName });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.count, 0);
      assert.strictEqual(res.data.results.length, 0);
      assert.strictEqual(res.data.count, res.data.results.length);
    });
  });

  describe('RPM Distribution - retrieve()', () => {
    const testRpmDistributionName = 'test-rpm-distribution-existent-retrieve';
    const testRpmDistributionBasePath =
      'test-rpm-distribution-existent-retrieve';
    let distributionPrn: string | undefined;
    let distributionHref: string | undefined;

    before(async () => {
      const created = await createAndWaitForResource<RPMDistributionType>(
        'distributions/rpm/rpm/',
        {
          name: testRpmDistributionName,
          base_path: testRpmDistributionBasePath,
        },
      );
      distributionHref = created.pulp_href;
      distributionPrn = created.prn;
    });

    after(async () => {
      await testAxiosClient(distributionHref, { method: 'DELETE' });
      distributionHref = undefined;
      distributionPrn = undefined;
    });

    it('retrieve() when passed correct identifier returns expected distribution', async () => {
      const distributionIdentifier = extractIdentifierFromPrn(distributionPrn);
      const client = createDistributionAPI(testPulpAPI());

      const res = await client.retrieve(distributionIdentifier);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.prn, distributionPrn);
      assert.strictEqual(res.data.name, testRpmDistributionName);
      assert.strictEqual(res.data.base_path, testRpmDistributionBasePath);
    });

    it('retrieve() when passed a non-existent identifier returns 404', async () => {
      const nonExistentDistributionIdentifer = '1234567890';
      const client = createDistributionAPI(testPulpAPI());

      await assert.rejects(
        () => client.retrieve(nonExistentDistributionIdentifer),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 404);
          return true;
        },
      );
    });
  });

  describe.skip('RPM Distribution - create()');

  describe.skip('RPM Distribution - update()');

  describe.skip('RPM Distribution - delete()');
});
