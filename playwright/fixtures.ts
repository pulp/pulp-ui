// https://playwright.dev/docs/test-fixtures#creating-a-fixture
import { test as base, expect } from '@playwright/test';

interface PulpFixtures {
  assertTitle: (title: string) => Promise<void>;
}

const test = base.extend<PulpFixtures>({
  assertTitle: async ({ page }, use) => {
    await use(async (title: string) => {
      await expect(
        page.getByRole('heading', { name: title, level: 1 }),
      ).toBeVisible();
    });
  },
});

export { test };
export { expect } from "@playwright/test";
