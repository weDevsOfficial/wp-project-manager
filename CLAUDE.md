# WP Project Manager — Free Plugin

WordPress project management plugin by weDevs (`wedevs-project-manager`). Teams manage projects, task lists, tasks, discussions, milestones, files, activities. v4.0.0. Free plugin in this repo. Pro plugin lives at `../pm-pro/` and extends this one via a `window.PM` bridge.

---

## Tech Stack

**Backend (PHP)**
- PHP ≥7.2, GPL-2.0+, WordPress plugin
- PSR-4: `WeDevs\PM\` → `src/`, `WeDevs\PM\Core\` → `core/`
- ORM: `tareq1988/wp-eloquent` (Illuminate Eloquent for WP)
- Serializer: `league/fractal` — Fractal includes via `?with=`, NOT `?include=`
- Custom REST router (`core/Router/`), NOT the WP REST API
- Auth: WordPress nonce + 29 permission classes in `core/Permissions/`
- DB: 20+ tables `wp_pm_*`, schema in `db/Create_Table.php`, migrations in `db/migrations/`
- Other libs: `simshaun/recurr`, `enshrined/svg-sanitize`, `appsero/client`
- Linting: PHPCS (`phpcs.xml.dist`, Plugin Check rulesets)

**Frontend (React)**
- React 18.3, Redux Toolkit 2.2, React Router 6.23 (hash-based for WP admin)
- Tailwind 3.4 (preflight OFF, `important: true`), shadcn/ui (Radix primitives)
- Tiptap 2.11 (rich text), @dnd-kit, lucide-react, sonner, recharts
- Build: `@wordpress/scripts` (Webpack 5 + PostCSS)
- Node 22, pnpm 9. Single-chunk bundle (`splitChunks: false`, `LimitChunkCountPlugin({maxChunks: 1})`)
- Entry: `views/assets/src/index.jsx` → mounts `#wedevs-pm`
- Output: `views/assets/dist/pm.js`, `views/assets/dist/pm.css`
- Aliases: `@` → `src/`, `@components`, `@store`, `@hooks`, `@lib`
- i18n: `@wordpress/i18n` fed from `PM_Vars.language.pm.locale_data['wedevs-project-manager']`

---

## Critical Commands

```bash
# Frontend
pnpm install                                       # install deps
pnpm dev                                           # wp-scripts start (watch)
pnpm build                                         # production build → views/assets/dist/
pnpm lint                                          # eslint views/assets/src --ext .ts,.tsx
pnpm makepot                                       # generate languages/wedevs-project-manager.pot
pnpm release                                       # grunt release --force (build + zip)

# Backend
composer install                                   # PHP deps (auto-runs patch-deprecations.php)
vendor/bin/phpcs                                   # lint PHP per phpcs.xml.dist
vendor/bin/phpcs --report-file=phpcs-report.txt    # write report

# Tests (Codeception + Playwright)
vendor/bin/codecept run unit                       # PHP unit
vendor/bin/codecept run acceptance                 # browser acceptance
vendor/bin/codecept run functional                 # WP functional
cd tests/e2e-playwright && npx playwright test     # E2E
```

**Run a single test:**
- Codeception: `vendor/bin/codecept run unit Path/To/TestCest.php:methodName`
- Playwright: `cd tests/e2e-playwright && npx playwright test path/to/spec.ts -g "test name"`

---

## Project Structure

```
.
├── cpm.php                       — plugin entry, defines PM_VERSION
├── bootstrap/
│   ├── loaders.php               — config/lib/route/ORM/migration loaders
│   └── start.php                 — boot sequence, fires `wedevs_pm_loaded`
├── core/                         — framework layer (WeDevs\PM\Core)
│   ├── Router/                   — custom REST router + WP_Router wrapper
│   ├── Database/                 — Eloquent setup + Migrater
│   ├── Permissions/              — 29 permission classes, each with can()
│   ├── WP/                       — WordPress integration (Frontend, hooks)
│   ├── Sanitizer/, Validator/    — request sanitization/validation
│   ├── Notifications/, Upgrades/, Cli/, Installer/, File_System/, …
├── src/                          — domain code (WeDevs\PM)
│   ├── Project/, Task/, Task_List/, Milestone/, Comment/, My_Task/
│   ├── Discussion_Board/, Activity/, Category/, File/, Role/, User/
│   ├── Search/, Reports/, Settings/, Tools/, Imports/
│   ├── GitHub/, Loom/, Notion/, Trello/, Pusher/, Calendar/
│   └── Common/                   — shared traits, models (Boardable, Board, Assignee)
├── routes/                       — auto-loaded REST route definitions
│   ├── project.php, task.php, task-list.php, milestone.php, comment.php
│   ├── activity.php, category.php, file.php, role.php, user.php
│   ├── settings.php, search.php, mytask.php, discussion-board.php
│   ├── github.php, loom.php, notion.php, trello.php, pusher.php
│   └── routes.php                — root registration
├── db/
│   ├── Create_Table.php          — full schema (20+ tables)
│   ├── migrations/               — incremental schema changes
│   └── seeds/                    — role table seeder
├── config/                       — auto-loaded config files
├── libs/                         — auto-loaded helper PHP libs (configurations.php etc.)
├── views/
│   ├── main.js                   — legacy entry stub
│   ├── emails/, project-switch/  — server-rendered templates
│   └── assets/
│       ├── src/                  — React app source
│       │   ├── index.jsx         — root: Provider, Router, window.PM API
│       │   ├── components/{ui,layout,projects,tasks,my-tasks,
│       │   │              admin-settings,common,upgrade,reports,
│       │   │              welcome,categories,settings,project-*,…}
│       │   ├── store/            — Redux slices (projects, tasks, taskLists,
│       │   │                       milestones, settings)
│       │   ├── hooks/            — useApi, useSlot, useProApi, usePermissions,
│       │   │                       useNavRegistry, useConfirm, useToast, …
│       │   ├── router/           — routeRegistry, router
│       │   ├── lib/              — sanitize, pm-utils, url-strippers,
│       │   │                       colorPresets, activity-links
│       │   ├── helpers/, directives/, start.js
│       │   └── tailwind.css
│       ├── dist/                 — BUILD OUTPUT (do not edit)
│       ├── css/, js/, vendor/    — legacy assets still referenced from PHP
│       └── images/
├── tests/                        — Codeception (unit/acceptance/functional) + Playwright
├── phpcs-xml/                    — PHPCS rulesets (plugin-check-*.xml)
├── composer-scripts/             — post-install patches
├── languages/                    — .pot, .po, .mo, .json (i18n)
├── .wordpress-org/               — wp.org plugin page assets
├── tailwind.config.js, webpack.config.js, postcss.config.js, jsconfig.json
├── composer.json, package.json, pnpm-lock.yaml, package-lock.json
├── phpcs.xml.dist, codeception.yml, Gruntfile.js
└── readme.txt                    — wp.org readme (NOT readme.md)
```

---

## Non-Obvious Conventions

### REST API (every endpoint)
- Base URL: `PM_Vars.rest_url` (e.g., `/wp-json/pm/v2/`)
- Auth header: `X-WP-Nonce: PM_Vars.permission` **(NOT `PM_Vars.nonce`)**
- Param required on every request: `is_admin: PM_Vars.is_admin`
- Fractal includes: `?with=assignees,comments` **(NOT `?include=`)**
- Frontend goes through `views/assets/src/hooks/useApi.js`. Never write raw `fetch` calls.

### Data type gotchas
- Task `status`: INTEGER `0`/`1` (NOT boolean)
- Project `status`: STRING `'incomplete' | 'complete' | 'archived' | 'favourite'`
- Task `estimation`: SECONDS in DB → divide by 60 for minutes in UI
- User attach/detach payload: comma-separated STRING `'1,5,12'` (NOT array)
- Task `assignees` on update: full replacement — partial array WIPES the rest

### Route definition pattern
```php
$wedevs_pm_router->post( 'projects/{project_id}/tasks',
    'WeDevs/PM/Task/Controllers/Task_Controller@store' )
    ->permission([ 'WeDevs\PM\Core\Permissions\Create_Task' ])
    ->validator( 'WeDevs\PM\Task\Validators\Create_Task' )
    ->sanitizer( 'WeDevs\PM\Task\Sanitizers\Task_Sanitizer' );
```
Always attach permission classes. Don't inline `current_user_can()` in the controller.

### CSS isolation (non-negotiable)
- All app styles scoped under `#wedevs-project-manager`
- CSS vars on `:root` so Radix portals get them
- Tailwind preflight DISABLED, `important: true` (boolean)
- All custom classes prefixed `pm-` (`pm-sidebar`, `pm-status-todo`, …)
- Banned class names (conflict with WP core): `.button .active .modal .form .card .table .spinner .notice .header`
- Max z-index: **700** (WP admin bar is 99999, media modal 160000)
- Radix portals render to `#pm-portal-root` inside the plugin root, NOT `document.body`

### Free ↔ Pro bridge
- Free exposes `window.PM` (see `views/assets/src/index.jsx` — slots, hooks, libs, ui, radix, components)
- Pro (in `../pm-pro/`) externalizes React, Redux, Sonner, Radix, etc. via webpack to use Free's instances
- Pro injects reducers (`window.PM.injectReducer`), routes (`window.PM.registerRoute`), nav items (`window.PM.registerNavItem`), slots/filters (`registerSlot/registerFilter`)
- WP action fires when Pro registers: `pm_slot_registered`

### Backend modification policy
- Backend is **not frozen** (per current direction). Normal PHP/route edits OK on feature branches.
- Still: every new endpoint needs a permission class, validator, sanitizer, and Fractal transformer.

### i18n
- React: `@wordpress/i18n` → `__()`, `sprintf()`. Locale data fed from `PM_Vars.language.pm.locale_data['wedevs-project-manager']` at boot.
- PHP: `__('text', 'wedevs-project-manager')`. Text domain MUST be the literal `'wedevs-project-manager'`.
- Build pot: `pnpm makepot`. Excludes node_modules, build, tests, vendor.

### Files / extensions
- React source uses `.jsx`, NOT `.tsx` (lint config mentions `.ts,.tsx` but there is no TS in tree)
- New components: `.jsx` to match existing.

---

## Do Not Touch

| Path | Reason |
|---|---|
| `vendor/` | Composer-managed |
| `node_modules/` | pnpm-managed |
| `views/assets/dist/` | Build output (regenerated by `pnpm build`) |
| `build/` | Release artifact dir |
| `composer.lock`, `pnpm-lock.yaml`, `package-lock.json` | Update only via package managers |
| `db/Create_Table.php` schema for existing tables | Add a migration in `db/migrations/` instead |
| `cpm.php` PM_VERSION constant | Bumped only via `pnpm release` (Gruntfile) |
| `languages/*.pot`, `*.po`, `*.mo` | Generated; edit source strings, then `pnpm makepot` |
| `compatibility-checker.php` | Legacy bootstrap guard — touch only with intent |

---

## Critical Paths (must not regress)

- `/projects` list + `/projects/:projectId/task-lists` (core navigation)
- Task create/update via `Task_Controller@store|update` + `useApi`
- Permission checks: `Access_Project`, `Authentic`, `Create_Task`, `Edit_Task`, `Complete_Task`, `Delete_Task`, `Administrator`
- Free→Pro window.PM contract (`views/assets/src/index.jsx`) — breaking it breaks Pro
- React i18n boot in `index.jsx` lines 5–10 (recent fix; do not regress)
- SVG sanitization filter in `bootstrap/loaders.php :: wedevs_pm_clean_svg()`

---

## Sensitive Paths

| Path | Treatment |
|---|---|
| `.env`, `.env.example` | Test DB credentials; never commit real values |
| `vendor/`, `node_modules/` | Never edit directly |
| `db/migrations/` | Migrations are append-only — never edit a shipped migration |
| `routes/*.php` | Public REST surface — changes are breaking |
| `core/Permissions/*` | Permission logic — changes affect auth everywhere |

---

## Detailed Rules

See `.claude/rules/`:
- `code-style.md` — PHP/JS naming, formatting, imports
- `php-backend.md` — routes, controllers, permissions, transformers, Eloquent
- `react-frontend.md` — components, Redux, hooks, useApi, CSS isolation
- `free-pro-bridge.md` — window.PM contract, Slots, injectReducer, externals
- `api-conventions.md` — REST endpoint design, nonce, params, response shape
- `testing.md` — Codeception + Playwright patterns
- `i18n.md` — text domain, JED pipeline, makepot
- `wordpress.md` — WP hooks, sanitization, capabilities

---

## Personal Overrides

Copy `CLAUDE.local.md.example` → `CLAUDE.local.md` for per-developer notes. The local file is gitignored.
