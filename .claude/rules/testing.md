# Testing

## Suites

- **Codeception** for PHP — config `codeception.yml`, suites `unit`, `acceptance`, `functional`.
- **Playwright** for browser E2E — under `tests/e2e-playwright/`.

## When to write a test

- New endpoint → Codeception functional asserting status + body shape.
- New permission class → Codeception functional with two users (allowed + denied).
- New Eloquent scope / query helper → Codeception unit.
- New UI flow that hits the API → Playwright spec.
- Bug fix → regression test FIRST. Reproduce red, then turn it green.

## Codeception layout

```
tests/
├── unit/              — pure PHP, no WP load (where possible)
├── functional/        — WP loaded, no browser
├── acceptance/        — full browser via WP runner
├── _data/             — fixtures
├── _support/          — Helpers, Cest base classes
├── _output/           — generated (gitignored)
└── *.suite.yml        — suite config
```

## Codeception conventions

- Files: `<Name>Cest.php`. Methods: `public function whatHappensWhenX(FunctionalTester $I)`.
- Use the `WeDevs\PM\Common\Traits\Transformer_Manager` etc. in test setup where the SUT depends on them.
- Always sanitize fixtures the way the controller would (the tests should reflect real input).

## Playwright conventions

- Specs in `tests/e2e-playwright/`.
- `npx playwright test` from that dir.
- Use `data-testid` attributes for stable selectors; avoid Tailwind class targeting.
- Network mocking: prefer the real backend (local WP). For isolation tests, intercept routes under `**/wp-json/pm/v2/**`.

## Running

```bash
# All PHP
vendor/bin/codecept run

# One suite
vendor/bin/codecept run unit
vendor/bin/codecept run functional
vendor/bin/codecept run acceptance

# Single test
vendor/bin/codecept run unit path/to/TaskCest.php
vendor/bin/codecept run unit path/to/TaskCest.php:whatHappensWhenX

# Playwright
cd tests/e2e-playwright
npx playwright test
npx playwright test path/to/spec.ts -g "name pattern"
npx playwright test --headed --debug
```

## What NOT to test

- Third-party libs (Eloquent, Fractal, Radix) — assume they work.
- Build output (`views/assets/dist/`).
- Migrations directly — instead, test the model with the migrated schema applied.

## CI

- No active GitHub Actions test runner (current workflows only deploy assets). TODO: confirm with team if CI test runs land somewhere else.
