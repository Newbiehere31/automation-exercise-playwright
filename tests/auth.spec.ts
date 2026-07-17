import { test } from './support/fixtures';

test.describe('Automation Exercise authentication', () => {
  test('shows login and signup forms', async ({ authPage }) => {
    await authPage.gotoLogin();

    await authPage.expectFormsVisible();
  });
});
