import { expect, test } from '@playwright/test';
import { blockThirdPartyAds } from './support/network';

test.describe('Automation Exercise contact form', () => {
  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);
  });

  test('submits the contact form successfully', async ({ page }) => {
    await page.goto('/contact_us', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /get in touch/i })).toBeVisible();

    await page.locator('[data-qa="name"]').fill('Exploring World Test');
    await page.locator('[data-qa="email"]').fill(`exploringworld678+contact-${Date.now()}@gmail.com`);
    await page.locator('[data-qa="subject"]').fill('Playwright contact form test');
    await page.locator('[data-qa="message"]').fill('This is an automated contact form test message.');

    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.locator('[data-qa="submit-button"]').click();

    await expect(page.locator('#contact-page .status')).toContainText(
      'Success! Your details have been submitted successfully.'
    );
    await page.locator('a.btn-success[href="/"]').click();
    await expect(page).toHaveURL(/\/$/);
  });
});
