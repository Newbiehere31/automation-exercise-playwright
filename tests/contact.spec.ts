import { test } from './support/fixtures';

test.describe('Automation Exercise contact form', () => {
  test('submits the contact form successfully', async ({ contactPage }) => {
    await contactPage.goto();

    await contactPage.submitMessage({
      name: 'Exploring World Test',
      email: `exploringworld678+contact-${Date.now()}@gmail.com`,
      subject: 'Playwright contact form test',
      message: 'This is an automated contact form test message.'
    });

    await contactPage.expectSubmissionSuccess();
    await contactPage.returnHome();
  });
});
