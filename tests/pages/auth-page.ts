import { expect, type Page } from '@playwright/test';
import type { AccountData } from '../support/test-data';

export class AuthPage {
  constructor(private readonly page: Page) {}

  async gotoLogin() {
    await this.page.goto('/login', { waitUntil: 'networkidle' });
    await this.waitForCsrfCookie();
  }

  async expectFormsVisible() {
    await expect(this.page.getByRole('heading', { name: /login to your account/i })).toBeVisible();
    await expect(this.page.locator('[data-qa="login-email"]')).toBeVisible();
    await expect(this.page.locator('[data-qa="login-password"]')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /new user signup/i })).toBeVisible();
    await expect(this.page.locator('[data-qa="signup-name"]')).toBeVisible();
  }

  async submitInvalidLogin(email: string, password: string) {
    await this.fillLoginCredentials(email, password);
    await this.loginForm().locator('[data-qa="login-button"]').click();
  }

  async fillLoginCredentials(email: string, password: string) {
    const form = this.loginForm();
    await form.locator('[data-qa="login-email"]').fill(email);
    await form.locator('[data-qa="login-password"]').fill(password);
  }

  async expectLoginCredentials(email: string, password: string) {
    const form = this.loginForm();
    await expect(form.locator('[data-qa="login-email"]')).toHaveValue(email);
    await expect(form.locator('[data-qa="login-password"]')).toHaveValue(password);
  }

  async expectLoginFormProtectedByCsrf() {
    await expect(this.loginForm().locator('input[name="csrfmiddlewaretoken"]')).toHaveValue(/\S+/);
  }

  async expectSignupFormProtectedByCsrf() {
    await expect(this.signupForm().locator('input[name="csrfmiddlewaretoken"]')).toHaveValue(/\S+/);
  }

  async fillSignupIdentity(account: AccountData) {
    const form = this.signupForm();
    await form.locator('[data-qa="signup-name"]').fill(account.name);
    await form.locator('[data-qa="signup-email"]').fill(account.email);
  }

  async expectSignupIdentity(account: AccountData) {
    const form = this.signupForm();
    await expect(form.locator('[data-qa="signup-name"]')).toHaveValue(account.name);
    await expect(form.locator('[data-qa="signup-email"]')).toHaveValue(account.email);
  }

  async submitLoginForm() {
    await this.loginForm().locator('[data-qa="login-button"]').click();
  }

  async expectInvalidLoginError() {
    await expect(this.page.getByText('Your email or password is incorrect!')).toBeVisible();
  }

  async startSignup(account: AccountData) {
    await this.fillSignupIdentity(account);
    await this.signupForm().locator('[data-qa="signup-button"]').click();
  }

  async completeAccountForm(account: AccountData, options: { newsletter?: boolean } = {}) {
    await expect(this.page.getByText('Enter Account Information')).toBeVisible();

    await this.page.getByLabel('Mr.').check();
    await this.page.getByLabel('Password').fill(account.password);
    await this.page.locator('#days').selectOption('10');
    await this.page.locator('#months').selectOption('May');
    await this.page.locator('#years').selectOption('1995');

    if (options.newsletter) {
      await this.page.getByLabel('Sign up for our newsletter!').check();
      await this.page.getByLabel('Receive special offers from our partners!').check();
    }

    await this.page.locator('[data-qa="first_name"]').fill(account.firstName);
    await this.page.locator('[data-qa="last_name"]').fill(account.lastName);
    await this.page.locator('[data-qa="company"]').fill(account.company);
    await this.page.locator('[data-qa="address"]').fill(account.address);
    await this.page.locator('[data-qa="address2"]').fill(account.address2);
    await this.page.locator('[data-qa="country"]').selectOption(account.country);
    await this.page.locator('[data-qa="state"]').fill(account.state);
    await this.page.locator('[data-qa="city"]').fill(account.city);
    await this.page.locator('#zipcode').fill(account.zipcode);
    await this.page.locator('[data-qa="mobile_number"]').fill(account.mobileNumber);
    await this.page.getByRole('button', { name: 'Create Account' }).click();
  }

  async createAccount(account: AccountData, options: { newsletter?: boolean } = {}) {
    await this.startSignup(account);
    await this.completeAccountForm(account, options);
    await this.expectAccountCreated();
    await this.continueAfterAccountCreated();
    await this.expectLoggedInAs(account.name);
  }

  async expectAccountCreated() {
    await expect(this.page.getByText('Account Created!')).toBeVisible();
  }

  async continueAfterAccountCreated() {
    await this.page.getByRole('link', { name: 'Continue' }).click();
  }

  async logout() {
    await this.page.getByRole('link', { name: /logout/i }).click();
    await expect(this.page.getByRole('heading', { name: /login to your account/i })).toBeVisible();
  }

  async login(account: Pick<AccountData, 'email' | 'password' | 'name'>) {
    const form = this.loginForm();
    await this.waitForCsrfCookie();
    await form.locator('[data-qa="login-email"]').fill(account.email);
    await form.locator('[data-qa="login-password"]').fill(account.password);
    await form.locator('[data-qa="login-button"]').click();
    await this.expectLoggedInAs(account.name);
  }

  async expectLoggedInAs(name: string) {
    await expect(this.page.getByText(`Logged in as ${name}`)).toBeVisible();
  }

  private loginForm() {
    return this.page.locator('form[action="/login"]');
  }

  private signupForm() {
    return this.page.locator('form[action="/signup"]');
  }

  private async waitForCsrfCookie() {
    await expect
      .poll(
        async () => {
          const cookies = await this.page.context().cookies();
          return cookies.some((cookie) => cookie.name === 'csrftoken');
        },
        { message: 'CSRF cookie should be set before submitting auth forms' }
      )
      .toBe(true);
  }
}
