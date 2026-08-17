import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import {
  testAxiosClient,
  testPulpAPI,
  waitForTaskCompletion,
} from '../../test-utils/integration-client.ts';
import { createDistributionAPI } from './distribution.ts';

describe('Integration: RPM Distribution API Client', () => {
  describe('RPM Distribution - list()', () => {
    const testRpmDistributionName = 'test-rpm-distribution-existent-list';
    const testRpmDistributionBasePath = 'test-rpm-distribution-existent-list';
    let distributionHref: string | undefined;

    before(async () => {
      const created = await testAxiosClient('distributions/rpm/rpm/', {
        method: 'POST',
        data: JSON.stringify({
          name: testRpmDistributionName,
          base_path: testRpmDistributionBasePath,
        }),
      });

      if (!created.data.task) {
        throw new Error('Failed to dispatch distribution create task');
      }

      await waitForTaskCompletion(created.data.task);
      const task = await testAxiosClient(created.data.task, { method: 'GET' });
      distributionHref = task.data.created_resources?.[0];

      if (!distributionHref) {
        throw new Error(
          'Failed to resolve created distribution href from task',
        );
      }
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

  describe.skip('RPM Distribution - retrieve()');

  describe.skip('RPM Distribution - create()');

  describe.skip('RPM Distribution - update()');

  describe.skip('RPM Distribution - delete()');
});
