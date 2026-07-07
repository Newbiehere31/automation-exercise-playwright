# Automation Exercise Playwright Tests

End-to-end tests for [Automation Exercise](https://automationexercise.com/) using Playwright, TypeScript, and Chromium/Firefox/WebKit.

## What Is Tested

- Home page title and navigation
- Products page navigation
- Login and signup form visibility
- Full signup flow with a fresh Gmail plus-address
- Invalid login error message
- Valid login after logout
- Product search and product detail verification
- Add product to cart and verify cart contents
- Contact form submission

## Run On This Machine

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
pnpm test:headed
pnpm test:ui
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

The custom report includes failed test stack traces and was verified with an intentional temporary failure.

## Project Structure

```text
.
├── reporters/
│   └── html-summary-reporter.ts
├── tests/
│   ├── auth.spec.ts
│   ├── cart.spec.ts
│   ├── contact.spec.ts
│   ├── home.spec.ts
│   ├── login.spec.ts
│   ├── products.spec.ts
│   ├── signup.spec.ts
│   └── support/
├── playwright.config.ts
└── package.json
```
