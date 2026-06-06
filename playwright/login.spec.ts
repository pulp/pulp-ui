import { test, expect } from '@playwright/test';
import { testPassword, testUsername } from './fixtures';

test("Login", async ({ page }) => {
  await page.goto('/ui/');

  await page.locator('[data-cy=pulp-menu-item-Login]').click();
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

  await page.locator('#pf-login-username-id').fill(testUsername);
  await page.locator('#pf-login-password-id').fill(testPassword);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByRole('heading', { name: 'Status' })).toBeVisible();
  await expect(page.locator('[data-cy=user-dropdown]')).toBeVisible();
});
