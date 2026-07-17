import { expect, type Page } from '@playwright/test';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
    await this.expectAllProducts();
  }

  async expectAllProducts() {
    await expect(this.page.getByRole('heading', { name: /all products/i })).toBeVisible();
  }

  async search(query: string) {
    await this.page.locator('#search_product').fill(query);
    await this.page.locator('#submit_search').click();
    await expect(this.page.getByRole('heading', { name: /searched products/i })).toBeVisible();
  }

  async expectSearchResultsVisible() {
    await expect(this.page.locator('.product-image-wrapper')).not.toHaveCount(0);
  }

  async openFirstProductDetail() {
    await this.page.getByRole('link', { name: /view product/i }).first().click();
  }

  async expectProductDetailVisible() {
    await expect(this.page).toHaveURL(/\/product_details\/\d+$/);
    await expect(this.page.locator('.product-information')).toContainText(/Category:/);
    await expect(this.page.locator('.product-information')).toContainText(/Availability:/);
    await expect(this.page.locator('.product-information')).toContainText(/Condition:/);
    await expect(this.page.locator('.product-information')).toContainText(/Brand:/);
  }

  async addFirstProductToCart() {
    const firstProduct = this.page.locator('.product-image-wrapper').first();
    const productName = (await firstProduct.locator('.productinfo p').innerText()).trim();

    await firstProduct.hover();
    await firstProduct.locator('.overlay-content a.add-to-cart').click();
    await expect(this.page.getByText('Added!')).toBeVisible();

    return productName;
  }

  async addDetailProductToCart(quantity: number) {
    const productName = (await this.page.locator('.product-information h2').innerText()).trim();
    await this.page.locator('#quantity').fill(String(quantity));
    await this.page.getByRole('button', { name: /add to cart/i }).click();
    await expect(this.page.getByText('Added!')).toBeVisible();

    return productName;
  }

  async viewCartFromModal() {
    await this.page.getByRole('link', { name: /view cart/i }).click();
  }
}
