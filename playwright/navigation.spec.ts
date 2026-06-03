import { test } from './fixtures';

test('/ renders "Status"', async ({ page, assertTitle }) => {
  await page.goto('/ui/ansible/repositories');
  await assertTitle('Repositories');
});
