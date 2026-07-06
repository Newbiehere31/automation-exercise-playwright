import { expect, test } from '@playwright/test';
import { blockThirdPartyAds } from './support/network';

test.describe('Automation Exercise authentication', () => {
  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);
  });

  test('shows login and signup forms', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /login to your account/i })).toBeVisible();
    await expect(page.getByPlaceholder('Email Address').first()).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('heading', { name: /new user signup/i })).toBeVisible();
    await expect(page.getByPlaceholder('Name')).toBeVisible();
  });
});
