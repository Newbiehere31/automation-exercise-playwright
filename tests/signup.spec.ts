import { expect, test } from '@playwright/test';
import { blockThirdPartyAds } from './support/network';

test.describe('Automation Exercise signup', () => {
  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);
  });

  test('creates a new account', async ({ page }, testInfo) => {
    test.setTimeout(60_000);

    const name = `Exploring World Test ${testInfo.project.name}`;
    const email = `exploringworld678+signup-${testInfo.project.name}-${Date.now()}@gmail.com`;
    const password = 'Test@12345';

    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.getByPlaceholder('Name').fill(name);
    await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
    await page.getByRole('button', { name: 'Signup' }).click();

    await expect(page.getByText('Enter Account Information')).toBeVisible();

    await page.getByLabel('Mr.').check();
    await page.getByLabel('Password').fill(password);
    await page.locator('#days').selectOption('10');
    await page.locator('#months').selectOption('May');
    await page.locator('#years').selectOption('1995');
    await page.getByLabel('Sign up for our newsletter!').check();
    await page.getByLabel('Receive special offers from our partners!').check();

    await page.locator('[data-qa="first_name"]').fill('Exploring');
    await page.locator('[data-qa="last_name"]').fill('World');
    await page.locator('[data-qa="company"]').fill('Test Automation');
    await page.locator('[data-qa="address"]').fill('123 Test Street');
    await page.locator('[data-qa="address2"]').fill('Suite 456');
    await page.locator('[data-qa="country"]').selectOption('United States');
    await page.locator('[data-qa="state"]').fill('California');
    await page.locator('[data-qa="city"]').fill('Los Angeles');
    await page.locator('#zipcode').fill('90001');
    await page.locator('[data-qa="mobile_number"]').fill('1234567890');

    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Account Created!')).toBeVisible();
    await page.getByRole('link', { name: 'Continue' }).click();

    await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();
  });
});
