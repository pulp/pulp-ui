import { test as base, expect } from '@playwright/test';

interface PulpFixtures {
  assertTitle: (title: string) => Promise<void>;
  goTo: (path: string) => Promise<void>;
}

type PlaywrightSessionStorage = Record<string, string>;

const basePath: string = process.env.PULP_BASE_UI_PATH ?? '/ui';
const baseAPI: string = process.env.PULP_BASE_API_PATH ?? '/pulp/api/v3/';
const testUsername: string = process.env.PULP_USERNAME ?? 'admin';
const testPassword: string = process.env.PULP_PASSWORD ?? 'admin';

const sessionStorageState = {
  credentials: JSON.stringify({
    username: testUsername,
    password: testPassword,
  }),
} satisfies PlaywrightSessionStorage;

const test = base.extend<PulpFixtures>({
  // Note: Due to how PulpUI uses SessionStorage, this approach follows guidance from the playwright documentation but applies the authentication to every page using fixtures.
  // Ref: https://playwright.dev/docs/auth#session-storage
  page: async ({ page }, use) => {
    await page.addInitScript((sessionStorage: PlaywrightSessionStorage) => {
      for (const [key, value] of Object.entries(sessionStorage)) {
        window.sessionStorage.setItem(key, value);
      }
    }, sessionStorageState);
    await use(page);
  },

  assertTitle: async ({ page }, use) => {
    await use(async (title: string) => {
      await expect(
        page.getByRole('heading', { name: title, level: 1 }),
      ).toBeVisible();
    });
  },

  goTo: async ({ page }, use) => {
    await use(async (path: string) => {
      await page.goto(basePath + path);
    });
  },
});

export { test, basePath, baseAPI, testUsername, testPassword };
export { expect } from '@playwright/test';
