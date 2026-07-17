import { expect, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async expectCartOpen() {
    await expect(this.page).toHaveURL(/\/view_cart$/);
    await expect(this.page.locator('#cart_info')).toBeVisible();
  }

  async expectProductRow(productName: string, quantity: number) {
    const cartInfo = this.page.locator('#cart_info');

    await expect(cartInfo).toContainText(productName);
    await expect(cartInfo).toContainText('Rs.');
    await expect(this.page.locator('.cart_quantity')).toContainText(String(quantity));
  }

  async removeFirstProduct() {
    await this.page.locator('.cart_quantity_delete').first().click();
  }

  async expectEmptyCart() {
    await expect(this.page.getByText('Cart is empty!')).toBeVisible();
  }
}
