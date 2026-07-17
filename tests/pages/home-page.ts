import { expect, type Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async expectMainNavigation() {
    await expect(this.page).toHaveTitle(/Automation Exercise/i);
    await expect(this.headerLink(/home/i)).toBeVisible();
    await expect(this.headerLink(/products/i)).toBeVisible();
    await expect(this.headerLink(/signup \/ login/i)).toBeVisible();
    await expect(this.headerLink(/test cases/i)).toBeVisible();
    await expect(this.headerLink(/contact us/i)).toBeVisible();
  }

  async openProducts() {
    await this.headerLink(/products/i).click();
  }

  async openTestCases() {
    await this.headerLink(/test cases/i).click();
  }

  async subscribe(email: string) {
    await this.page.locator('footer').scrollIntoViewIfNeeded();
    await expect(this.page.getByRole('heading', { name: /subscription/i })).toBeVisible();
    await this.page.locator('#susbscribe_email').fill(email);
    await this.page.locator('#subscribe').click();
  }

  async expectSubscriptionSuccess() {
    await expect(this.page.locator('.alert-success')).toContainText('You have been successfully subscribed!');
  }

  private headerLink(name: RegExp) {
    return this.page.locator('.shop-menu').getByRole('link', { name });
  }
}
