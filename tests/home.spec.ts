import { expect, test } from './support/fixtures';

test.describe('Automation Exercise home page', () => {
  test('loads the home page and shows main navigation', async ({ homePage }) => {
    await homePage.goto();

    await homePage.expectMainNavigation();
  });

  test('opens the products page', async ({ homePage, productsPage, page }) => {
    await homePage.goto();
    await homePage.openProducts();

    await expect(page).toHaveURL(/\/products$/);
    await productsPage.expectAllProducts();
  });

  test('opens the test cases page from navigation', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.openTestCases();

    await expect(page).toHaveURL(/\/test_cases$/);
    await expect(page.locator('b').filter({ hasText: /^Test Cases$/ })).toBeVisible();
  });

  test('subscribes from the home page footer', async ({ homePage }, testInfo) => {
    await homePage.goto();
    await homePage.subscribe(`exploringworld678+subscribe-${testInfo.project.name}-${Date.now()}@gmail.com`);

    await homePage.expectSubscriptionSuccess();
  });
});
