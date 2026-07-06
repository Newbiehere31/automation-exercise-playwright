import type { Page } from '@playwright/test';

const blockedHosts = [
  'doubleclick.net',
  'googleadservices.com',
  'googlesyndication.com',
  'googletagmanager.com',
  'google-analytics.com'
];

export async function blockThirdPartyAds(page: Page) {
  await page.route('**/*', async (route) => {
    const host = new URL(route.request().url()).hostname;

    if (blockedHosts.some((blockedHost) => host.includes(blockedHost))) {
      await route.abort();
      return;
    }

    await route.continue();
  });
}
