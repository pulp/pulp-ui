// https://playwright.dev/docs/test-fixtures#creating-a-fixture
import { test as base, expect } from '@playwright/test';

interface PulpFixtures {
  assertTitle: (title: string) => Promise<void>;
}

type PlaywrightSessionStorage = Record<string, string>;

const sessionStorageState = {
  credentials: JSON.stringify({
    username: process.env.PULP_USERNAME ?? 'admin',
    password: process.env.PULP_PASSWORD ?? 'admin',
  }),
} satisfies PlaywrightSessionStorage;

const test = base.extend<PulpFixtures>({
  assertTitle: async ({ page }, use) => {
    await use(async (title: string) => {
      await expect(
        page.getByRole('heading', { name: title, level: 1 }),
      ).toBeVisible();
    });
  },

  page: async ({ page }, use) => {
    await page.addInitScript((sessionStorage: PlaywrightSessionStorage) => {
      for (const [key, value] of Object.entries(sessionStorage)) {
        window.sessionStorage.setItem(key, value);
      }
    }, sessionStorageState);
    await use(page);
  },
});

export { test };
export { expect } from '@playwright/test';
