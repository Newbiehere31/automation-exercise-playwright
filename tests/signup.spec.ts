import { test } from './support/fixtures';
import { createAccountData } from './support/test-data';

test.describe('Automation Exercise signup', () => {
  test('accepts signup identity details in a CSRF-protected form', async ({ authPage }, testInfo) => {
    const account = createAccountData(testInfo, 'Signup Test');

    await authPage.gotoLogin();
    await authPage.expectSignupFormProtectedByCsrf();
    await authPage.fillSignupIdentity(account);

    await authPage.expectSignupIdentity(account);
  });
});
