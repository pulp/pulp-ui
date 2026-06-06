import { expect, test as unauthenticatedTest } from '@playwright/test';
import { test as authenticatedTest, basePath } from './fixtures';

interface Testpath {
  path: string;
  title: string;
}

const authenticatedPaths = [
  { path: '/ansible/repositories', title: 'Repositories' },
  { path: '/file/repositories', title: 'Repositories' },
  { path: '/ansible/remotes', title: 'Remotes' },
  { path: '/file/remotes', title: 'Remotes' },
  { path: '/rpm/rpms', title: 'Packages' },
  { path: '/tasks', title: 'Task management' },
  { path: '/users', title: 'Users' },
  { path: '/roles', title: 'Roles' },
  { path: '/groups', title: 'Groups' },
] satisfies Testpath[];

const unauthenticatedPaths = [
  { path: '/status', title: 'Status' },
  { path: '/about', title: 'About project' },
] satisfies Testpath[];

authenticatedTest.describe('Smoke: Authenticated Navigation paths', () => {
  authenticatedPaths.forEach(({ path, title }) => {
    authenticatedTest(
      `${path} renders with ${title}`,
      async ({ assertTitle, goTo }) => {
        await goTo(path);
        await assertTitle(title);
      },
    );
  });
});

unauthenticatedTest.describe('Smoke: Unauthenticated Navigation paths', () => {
  unauthenticatedPaths.forEach(({ path, title }) => {
    unauthenticatedTest(`${path} renders with ${title}`, async ({ page }) => {
      await page.goto(basePath + path);
      await expect(
        page.getByRole('heading', { name: title, level: 1 }),
      ).toBeVisible();
    });
  });
});
