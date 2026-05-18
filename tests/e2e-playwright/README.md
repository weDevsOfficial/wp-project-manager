# weDevs Project Manager E2E Tests (Playwright + pnpm)

Automated e2e tests for the **Free** version of weDevs Project Manager. Mirrors the pattern used by WPUF e2e (shared helpers, spec naming, features-map, sharded parallel runs).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Environment](#environment)
- [Running Tests](#running-tests)
- [Project Layout](#project-layout)
- [Test ID Convention](#test-id-convention)
- [Reports & Summary](#reports--summary)
- [Pro vs Free Scope](#pro-vs-free-scope)

## Prerequisites

- Node `>= 22`
- pnpm `>= 9`
- WordPress site with weDevs Project Manager **Free** active
- Optional: `wp-mail-log`, `wp-reset` plugins (for email asserts + DB wipes)

## Install

```bash
cd wp-content/plugins/wedevs-project-manager/tests/e2e-playwright
pnpm install
pnpm run install:browsers
```

## Environment

Copy `.env-example` to `.env` and fill in local admin credentials + site URL:

```
QA_BASE_URL="http://we-pm.test"
QA_ADMIN_USERNAME="admin"
QA_ADMIN_PASSWORD="password"
```

## Running Tests

### Full run (sequential, headed)

```bash
pnpm run test
```

### CI run (headless, JSON + HTML reports)

```bash
pnpm run test:ci
```

### Setup phase only (serial fail-fast)

```bash
pnpm run test:setup
```

### Sharded parallel run (setup → parallel-one → parallel-two)

```bash
pnpm run test:sharded
```

### Run a single spec

```bash
pnpm exec playwright test tests/projectTest.spec.ts
```

### Debug with Playwright Inspector

```bash
pnpm exec playwright test --debug
```

### View last HTML report

```bash
pnpm exec playwright show-report
```

## Project Layout

```
tests/e2e-playwright/
├── package.json
├── playwright.config.ts               # main config (workers: 1)
├── playwright.setup.config.ts         # alphaSetupTest only
├── playwright.parallel-one.config.ts  # project/taskList/task/myTasks (workers: 3)
├── playwright.parallel-two.config.ts  # milestone/discussion/file/category/settings/roles/ai (workers: 2)
├── tsconfig.json / .eslintrc.json / .prettierrc
├── .env-example / .wp-env.json / .wp-env.override
├── tests/                             # spec files
├── pages/                             # page objects (POM)
├── utils/                             # testData, apiHelper, specFailFast, summary
├── features-map/features-map.yml      # test ID registry
├── uploadeditems/                     # upload fixtures (sample.jpg)
└── PLAN.md                            # original test plan
```

## Test ID Convention

Every test title starts with a prefixed ID: `PF0001 : Description`.

| Prefix | Area                    |
|--------|-------------------------|
| LS     | Login / Setup           |
| PJ     | Projects                |
| TL     | Task Lists              |
| TK     | Tasks                   |
| MS     | Milestones              |
| DC     | Discussions / Comments  |
| FU     | File Uploads            |
| CT     | Categories              |
| ST     | Settings                |
| RP     | Free Permissions        |
| MT     | My Tasks                |
| AI     | AI Task Generation      |
| PU     | Pro Upsell (free-only)  |

IDs feed the `features-map.yml` registry and are parsed by `utils/generate-summary.js` to emit a pass/fail coverage table.

## Reports & Summary

Playwright writes:

- JSON: `./test-results/results.json`
- HTML: `./playwright-report/`

Generate markdown summary mapped to features-map:

```bash
pnpm run generate-summary        # single-run output
pnpm run sharded-summary         # aggregate across setup + parallel-one + parallel-two
```

## Pro vs Free Scope

This suite tests **Free functionality only**. Pro features (Kanban, Gantt, Time Tracker, Invoice, BuddyPress, WooCommerce, Slack, GitHub, Reports, Recurring Tasks, Calendar-for-managers, Trello/Asana import, etc.) are covered in the separate pro e2e suite.

A single `proModalTest.spec.ts` is included for the **free-mode upsell surfaces** (Premium menu link, `#/premium` route, upgrade modal CTA). Each test auto-skips via `test.skip()` when it detects `PM_Vars.is_pro === true` at runtime, so the suite stays green on sites where Pro is active.

## Design Notes

- **No storageState**: each spec launches fresh context + logs in via `BasicLoginPage`. Matches wpuf pattern.
- **SPA hydration**: `Base.waitForPmSpa()` waits for `#wedevs-project-manager` mount + first `/pm/v2/projects` response.
- **AI endpoint**: always stubbed via `page.route()`. Never call the real OpenAI/Anthropic/Google endpoint.
- **Dnd-kit drag**: use `locator.dragTo({ force: true })`; validate via `/tasks/reorder` response.
- **Fail-fast**: each spec calls `configureSpecFailFast()` so suites abort on first failure.

## Troubleshooting

- **SPA never mounts**: confirm the plugin is active and the admin menu `pm_projects` exists.
- **Login loops**: clear cookies or hit `/wp-login.php?action=logout` between runs.
- **File upload missing**: add `uploadeditems/sample.jpg` (any small JPG under 100KB).
- **REST nonce fetch fails**: ensure `/wp-admin/admin-ajax.php?action=rest-nonce` returns a non-zero string for logged-in admin.
