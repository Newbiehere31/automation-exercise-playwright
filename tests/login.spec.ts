import { expect, test } from '@playwright/test';
import { blockThirdPartyAds } from './support/network';

test.describe('Automation Exercise login', () => {
  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);
  });

  test('shows an error for invalid login details', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await page
      .locator('form')
      .filter({ hasText: 'Login' })
      .getByPlaceholder('Email Address')
      .fill('exploringworld678+wrong@gmail.com');
    await page.getByPlaceholder('Password').fill('WrongPassword123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
  });

  test('logs in with a valid account after logout', async ({ page }, testInfo) => {
    test.setTimeout(60_000);

    const name = `Login Test ${testInfo.project.name}`;
    const email = `exploringworld678+login-${testInfo.project.name}-${Date.now()}@gmail.com`;
    const password = 'Login@Test123';

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
    await page.locator('[data-qa="first_name"]').fill('Login');
    await page.locator('[data-qa="last_name"]').fill('Test');
    await page.locator('[data-qa="company"]').fill('Test Automation');
    await page.locator('[data-qa="address"]').fill('123 Login Street');
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

    await page.getByRole('link', { name: /logout/i }).click();
    await expect(page.getByRole('heading', { name: /login to your account/i })).toBeVisible();

    await page
      .locator('form')
      .filter({ hasText: 'Login' })
      .getByPlaceholder('Email Address')
      .fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();
  });
});
