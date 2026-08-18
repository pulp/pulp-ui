import { isAxiosError } from 'axios';
import assert from 'node:assert/strict';
import { after, afterEach, before, describe, it } from 'node:test';
import {
  createAndWaitForResource,
  extractIdentifierFromPrn,
  testAxiosClient,
  testPulpAPI,
  waitForTaskCompletion,
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

  describe('RPM Distribution - create()', () => {
    const testRpmDistributionBasePath = 'test-rpm-distribution-create';
    let distributionHref: string | undefined;

    afterEach(async () => {
      if (distributionHref) {
        await testAxiosClient(distributionHref, { method: 'DELETE' });
        distributionHref = undefined;
      }
    });

    it('create() when giving only the required fields dispatches a task, and the created distribution has expected defaults upon task completion', async () => {
      const testRpmDistributionName = 'test-rpm-distribution-create-minimal';
      const client = createDistributionAPI(testPulpAPI());

      const res = await client.create({
        name: testRpmDistributionName,
        base_path: testRpmDistributionBasePath,
      });

      assert.strictEqual(res.status, 202);
      assert.notStrictEqual(res.data.task, undefined);

      await waitForTaskCompletion(res.data.task);
      const task = await testAxiosClient(res.data.task, { method: 'GET' });
      distributionHref = task.data.created_resources?.[0];

      const created = await testAxiosClient(distributionHref, {
        method: 'GET',
      });

      assert.strictEqual(created.data.name, testRpmDistributionName);
      assert.strictEqual(created.data.base_path, testRpmDistributionBasePath);
      assert.strictEqual(created.data.generate_repo_config, false);
    });

    it('create() when given additional optional fields dispatches a task and are reflected on task completion', async () => {
      const testRpmDistributionName = 'test-rpm-distribution-create-full';
      const client = createDistributionAPI(testPulpAPI());
      const payload = {
        name: testRpmDistributionName,
        base_path: testRpmDistributionBasePath,
        generate_repo_config: true,
      } satisfies RPMDistributionType;

      const res = await client.create(payload);

      assert.strictEqual(res.status, 202);
      assert.notStrictEqual(res.data.task, undefined);

      await waitForTaskCompletion(res.data.task);
      const task = await testAxiosClient(res.data.task, { method: 'GET' });
      distributionHref = task.data.created_resources?.[0];

      const created = await testAxiosClient(distributionHref, {
        method: 'GET',
      });

      assert.strictEqual(created.data.name, payload.name);
      assert.strictEqual(created.data.base_path, payload.base_path);
      assert.strictEqual(
        created.data.generate_repo_config,
        payload.generate_repo_config,
      );
    });

    it('create() when passed a duplicate base_path returns 400', async () => {
      const testRpmDistributionNameOne = 'test-rpm-distribution-create-dup-one';
      const testRpmDistributionNameTwo = 'test-rpm-distribution-create-dup-two';
      const client = createDistributionAPI(testPulpAPI());

      const firstPayload = await client.create({
        name: testRpmDistributionNameOne,
        base_path: testRpmDistributionBasePath,
      });
      await waitForTaskCompletion(firstPayload.data.task);
      const task = await testAxiosClient(firstPayload.data.task, {
        method: 'GET',
      });
      distributionHref = task.data.created_resources?.[0];

      await assert.rejects(
        () =>
          client.create({
            name: testRpmDistributionNameTwo,
            base_path: testRpmDistributionBasePath,
          }),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    it('create() when missing the required name field returns 400', async () => {
      const client = createDistributionAPI(testPulpAPI());

      await assert.rejects(
        () =>
          client.create({
            base_path: testRpmDistributionBasePath,
          } as RPMDistributionType),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });

    it('create() when missing the required base_path field returns 400', async () => {
      const testRpmDistributionName =
        'test-rpm-distribution-create-missing-base-path';
      const client = createDistributionAPI(testPulpAPI());

      await assert.rejects(
        () =>
          client.create({
            name: testRpmDistributionName,
          } as RPMDistributionType),
        (err: unknown) => {
          assert.ok(isAxiosError(err));
          assert.strictEqual(err.response?.status, 400);
          return true;
        },
      );
    });
  });

  describe.skip('RPM Distribution - update()');

  describe.skip('RPM Distribution - delete()');
});
