import { expect, test as unauthenticatedTest } from '@playwright/test';
import { test as authenticatedTest } from './fixtures';

// TODO: Create fixture to remove the need for /ui/ all the time
// TODO: Type Safety??
const authenticatedRoutes = [
  { route: '/ui/ansible/repositories', title: 'Repositories' },
  { route: '/ui/file/repositories', title: 'Repositories' },
  // FIXME: 401 Error causing visibility issue of title
  // { route: '/ui/ansible/remotes', title: 'Remotes' },
  // { route: '/ui/file/remotes', title: 'Remotes' },
  // { route: '/ui/rpm/rpms', title: 'Packages' },
  // { route: '/ui/tasks', title: 'Task management' },
  // { route: '/ui/users', title: 'Users' },
  // { route: '/ui/roles', title: 'Roles' },
  // { route: '/ui/groups', title: 'Groups' },
];

const unauthenticatedRoutes = [
  { route: '/ui/status', title: 'Status' },
  { route: '/ui/about', title: 'About project' },
];

// TODO: Move to https://playwright.dev/docs/test-parameterize
for (const { route, title } of authenticatedRoutes) {
  authenticatedTest(
    `${route} renders with ${title}`,
    async ({ page, assertTitle }) => {
      await page.goto(route);
      await assertTitle('Repositories');
    },
  );
}

for (const { route, title } of unauthenticatedRoutes) {
  unauthenticatedTest(`${route} renders with ${title}`, async ({ page }) => {
    await page.goto(route);
    await expect(
      page.getByRole('heading', { name: title, level: 1 }),
    ).toBeVisible();
  });
}
