import { test } from './support/fixtures';

test.describe('Automation Exercise cart', () => {
  test('adds a product to the cart and views the cart', async ({ productsPage, cartPage }) => {
    await productsPage.goto();

    const productName = await productsPage.addFirstProductToCart();
    await productsPage.viewCartFromModal();

    await cartPage.expectCartOpen();
    await cartPage.expectProductRow(productName, 1);
  });

  test('adds a product with custom quantity from the detail page', async ({ productsPage, cartPage }) => {
    await productsPage.goto();
    await productsPage.openFirstProductDetail();
    await productsPage.expectProductDetailVisible();

    const productName = await productsPage.addDetailProductToCart(3);
    await productsPage.viewCartFromModal();

    await cartPage.expectCartOpen();
    await cartPage.expectProductRow(productName, 3);
  });

  test('removes a product from the cart', async ({ productsPage, cartPage }) => {
    await productsPage.goto();

    await productsPage.addFirstProductToCart();
    await productsPage.viewCartFromModal();
    await cartPage.expectCartOpen();
    await cartPage.removeFirstProduct();

    await cartPage.expectEmptyCart();
  });
});
