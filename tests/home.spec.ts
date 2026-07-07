import { expect, test } from '@playwright/test';
import { blockThirdPartyAds } from './support/network';

test.describe('Automation Exercise home page', () => {
  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);
  });

  test('loads the home page and shows main navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveTitle(/Automation Exercise/i);
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /products/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /signup \/ login/i })).toBeVisible();
  });

  test('opens the products page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('link', { name: /products/i }).click();

    await expect(page).toHaveURL(/\/products$/);
    await expect(page.getByRole('heading', { name: /all products/i })).toBeVisible();
  });
});
