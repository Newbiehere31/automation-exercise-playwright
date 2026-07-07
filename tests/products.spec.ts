import { expect, test } from '@playwright/test';
import { blockThirdPartyAds } from './support/network';

test.describe('Automation Exercise products', () => {
  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);
  });

  test('searches products and opens a product detail page', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /all products/i })).toBeVisible();

    await page.locator('#search_product').fill('dress');
    await page.locator('#submit_search').click();

    await expect(page.getByRole('heading', { name: /searched products/i })).toBeVisible();
    await expect(page.locator('.product-image-wrapper')).not.toHaveCount(0);

    await page.getByRole('link', { name: /view product/i }).first().click();

    await expect(page).toHaveURL(/\/product_details\/\d+$/);
    await expect(page.locator('.product-information')).toContainText(/Category:/);
    await expect(page.locator('.product-information')).toContainText(/Availability:/);
    await expect(page.locator('.product-information')).toContainText(/Condition:/);
    await expect(page.locator('.product-information')).toContainText(/Brand:/);
  });
});
