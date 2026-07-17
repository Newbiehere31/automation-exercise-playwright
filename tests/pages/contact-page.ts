import { expect, type Page } from '@playwright/test';

export class ContactPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/contact_us', { waitUntil: 'domcontentloaded' });
    await expect(this.page.getByRole('heading', { name: /get in touch/i })).toBeVisible();
  }

  async submitMessage(data: { name: string; email: string; subject: string; message: string }) {
    await this.page.locator('[data-qa="name"]').fill(data.name);
    await this.page.locator('[data-qa="email"]').fill(data.email);
    await this.page.locator('[data-qa="subject"]').fill(data.subject);
    await this.page.locator('[data-qa="message"]').fill(data.message);

    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await this.page.locator('[data-qa="submit-button"]').click();
  }

  async expectSubmissionSuccess() {
    await expect(this.page.locator('#contact-page .status')).toContainText(
      'Success! Your details have been submitted successfully.'
    );
  }

  async returnHome() {
    await this.page.locator('a.btn-success[href="/"]').click();
    await expect(this.page).toHaveURL(/\/$/);
  }
}
