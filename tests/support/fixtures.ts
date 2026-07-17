import { expect, test as base } from '@playwright/test';
import { AuthPage } from '../pages/auth-page';
import { CartPage } from '../pages/cart-page';
import { ContactPage } from '../pages/contact-page';
import { HomePage } from '../pages/home-page';
import { ProductsPage } from '../pages/products-page';
import { blockThirdPartyAds } from './network';

type AutomationFixtures = {
  authPage: AuthPage;
  cartPage: CartPage;
  contactPage: ContactPage;
  homePage: HomePage;
  productsPage: ProductsPage;
};

export const test = base.extend<AutomationFixtures>({
  page: async ({ page }, use) => {
    await blockThirdPartyAds(page);
    await use(page);
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  }
});

export { expect };
