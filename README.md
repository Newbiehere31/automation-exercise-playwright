# Automation Exercise Playwright Tests

End-to-end tests for [Automation Exercise](https://automationexercise.com/) using Playwright, TypeScript, and Chromium/Firefox/WebKit.

## What Is Tested

- Home page title and main navigation
- Products page navigation
- Test Cases page navigation
- Footer subscription success message
- Login and signup form visibility
- Login form CSRF protection and credential entry
- Signup form CSRF protection and identity entry
- Login/signup form isolation
- Product search and product detail verification
- Add product to cart and verify cart contents
- Add product with custom quantity from product details
- Remove product from cart
- Contact form submission and return-home flow

This project does not delete accounts after tests.

Note: the public Automation Exercise auth POST endpoints currently return a live-site `403 CSRF verification failed` response to automated login/signup submissions. The submit helpers remain in the page object, but the active suite avoids fake auth success and verifies the forms without submitting them.

## Run On This Machine

Use these Windows helpers if `pnpm` is not available from your normal terminal:

```bat
install-browsers.cmd
run-tests.cmd
open-report.cmd
```

## Run With pnpm

```bash
pnpm install
pnpm exec playwright install
pnpm test
```

Useful commands:

```bash
pnpm test
pnpm test:chromium
pnpm test:firefox
pnpm test:webkit
pnpm test:headed
pnpm test:ui
pnpm test:debug
pnpm report
```

## Reports

Playwright's standard report is created here:

```text
playwright-report/index.html
```

The custom summary report is created here:

```text
playwright-report/automationexercise-playwright-summary.html
```

The custom report includes totals, per-test durations, failed test names, error messages, and stack traces. Failure reporting was verified earlier with an intentional temporary failure.

## Project Structure

```text
.
|-- reporters/
|   `-- html-summary-reporter.ts
|-- tests/
|   |-- pages/
|   |   |-- auth-page.ts
|   |   |-- cart-page.ts
|   |   |-- contact-page.ts
|   |   |-- home-page.ts
|   |   `-- products-page.ts
|   |-- support/
|   |   |-- fixtures.ts
|   |   |-- network.ts
|   |   `-- test-data.ts
|   |-- auth.spec.ts
|   |-- cart.spec.ts
|   |-- contact.spec.ts
|   |-- home.spec.ts
|   |-- login.spec.ts
|   |-- products.spec.ts
|   `-- signup.spec.ts
|-- install-browsers.cmd
|-- open-report.cmd
|-- playwright.config.ts
|-- run-tests.cmd
|-- package.json
`-- tsconfig.json
```

## Design Notes

- `tests/support/fixtures.ts` applies common browser setup and creates page objects for each test.
- `tests/pages/*` keeps selectors and page actions out of spec files.
- `tests/support/test-data.ts` creates unique account data for signup/login tests.
- `tests/support/network.ts` blocks common third-party ad/analytics hosts to reduce live-site flakiness.
