import { test } from './support/fixtures';
import { createAccountData } from './support/test-data';

test.describe('Automation Exercise login', () => {
  test('accepts login credentials in a CSRF-protected form', async ({ authPage }) => {
    await authPage.gotoLogin();
    await authPage.expectLoginFormProtectedByCsrf();
    await authPage.fillLoginCredentials('exploringworld678+wrong@gmail.com', 'WrongPassword123');

    await authPage.expectLoginCredentials('exploringworld678+wrong@gmail.com', 'WrongPassword123');
  });

  test('keeps login and signup form data isolated', async ({ authPage }, testInfo) => {
    const account = createAccountData(testInfo, 'Login Test');

    await authPage.gotoLogin();
    await authPage.fillSignupIdentity(account);
    await authPage.fillLoginCredentials('exploringworld678+login-check@gmail.com', 'Login@Test123');

    await authPage.expectSignupIdentity(account);
    await authPage.expectLoginCredentials('exploringworld678+login-check@gmail.com', 'Login@Test123');
  });
});
