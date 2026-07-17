import { test } from './support/fixtures';

test.describe('Automation Exercise products', () => {
  test('searches products and opens a product detail page', async ({ productsPage }) => {
    await productsPage.goto();

    await productsPage.search('dress');
    await productsPage.expectSearchResultsVisible();
    await productsPage.openFirstProductDetail();

    await productsPage.expectProductDetailVisible();
  });
});
