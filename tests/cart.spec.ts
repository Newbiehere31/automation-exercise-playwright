import { expect, test } from '@playwright/test';
import { blockThirdPartyAds } from './support/network';

test.describe('Automation Exercise cart', () => {
  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);
  });

  test('adds a product to the cart and views the cart', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /all products/i })).toBeVisible();

    const firstProduct = page.locator('.product-image-wrapper').first();
    const productName = (await firstProduct.locator('.productinfo p').innerText()).trim();

    await firstProduct.hover();
    await firstProduct.locator('.overlay-content a.add-to-cart').click();

    await expect(page.getByText('Added!')).toBeVisible();
    await page.getByRole('link', { name: /view cart/i }).click();

    await expect(page).toHaveURL(/\/view_cart$/);
    await expect(page.locator('#cart_info')).toContainText(productName);
    await expect(page.locator('#cart_info')).toContainText('Rs.');
    await expect(page.locator('.cart_quantity')).toContainText('1');
  });
});
