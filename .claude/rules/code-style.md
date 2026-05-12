# Code Style

## PHP

- **PSR-4** autoloading: `WeDevs\PM\` → `src/`, `WeDevs\PM\Core\` → `core/`.
- **Indentation:** 4 spaces. Match existing files.
- **Naming:**
  - Classes: `PascalCase_With_Underscores` (legacy WP style — match existing, e.g., `Task_Controller`, `Create_Task`, `Project_Transformer`).
  - Methods: `snake_case` (`change_status`, `get_tasks`).
  - Variables: `$snake_case`.
  - Constants: `UPPER_SNAKE` (`PM_VERSION`, `PM_FILE`).
- **File header:** new top-level PHP files include
  ```php
  <?php
  if ( ! defined( 'ABSPATH' ) ) { exit; }
  ```
- **Namespace** declared on the first non-comment line.
- **Use statements** grouped (vendor, then internal), one per line.
- **Sanitization first** — sanitize at controller entry, not in models.
- **No raw SQL** for table inserts/updates — use Eloquent. Raw SQL acceptable only for migrations / schema introspection.
- **WordPress text domain:** literal `'wedevs-project-manager'` (string). Never a variable. Never concatenated.
- **Hooks:** `do_action()` / `apply_filters()` named `pm_<verb>_<noun>` (e.g., `pm_after_new_task`).
- **Line endings:** LF (`.editorconfig`).
- **Final newline** at EOF.

## JavaScript / JSX

- **Files:** `.jsx` for components, `.js` for plain modules. No `.tsx` in tree (lint config mentions TS but it's unused — match existing).
- **Indentation:** 2 spaces (match existing `views/assets/src/**`).
- **Imports:**
  - Order: React → third-party → `@` aliases → relative → CSS.
  - Aliases: `@`, `@components`, `@store`, `@hooks`, `@lib` (see `webpack.config.js`).
  - Default import for React: `import React from 'react'`.
  - Side-effect imports last (`import './styles.css'`).
- **Naming:**
  - Components: `PascalCase` (file + export).
  - Hooks: `useCamelCase` (file `useThing.js`).
  - Redux slices: `<feature>Slice.js`, exports `<feature>Slice`.
  - Async thunks: `<feature>/<verb>` (e.g., `tasks/fetch`).
  - Utility functions: `camelCase`.
  - Constants: `UPPER_SNAKE` for module-level, `camelCase` for local.
- **Components:** functional + hooks only. No class components.
- **Default vs named exports:** prefer named exports for components and hooks. Lazy-loaded pages use default export (see `index.jsx` `React.lazy()` calls).
- **Props:** destructure in signature. Mark JSDoc shape for public components.
- **Async:** `async`/`await`. No `.then().catch()` chains except for Redux thunk integration.
- **Quotes:** single `'…'`. Backticks for templates.
- **Semicolons:** off (existing files omit them). Match the surrounding file.
- **Trailing commas:** match the file.
- **Tailwind utilities:** join with `cn()` from `@lib/pm-utils` (or `@/lib/pm-utils`).

## CSS

- **Class prefix:** `pm-` for every custom class.
- **Scope:** all rules live under `#wedevs-project-manager`. CSS variables on `:root` (so Radix portals inherit).
- **No `!important` in handwritten CSS** — Tailwind utilities already carry `!important` via config (`important: true`). Use a utility instead.
- **Banned class names** (collide with WP core): `.button .active .modal .form .card .table .spinner .notice .header`.
- **Z-index max: 700.** Never exceed.

## Comments

- Default: **no comments**. Names should explain the what.
- Write a comment only when the **why** is non-obvious — a workaround, an invariant, a hidden constraint. One short line max.
- No multi-paragraph doc blocks. No "added for issue #123" rot.
- PHPDoc on PUBLIC controller methods is fine when it documents the route shape; otherwise skip.

## Logging

- PHP: `error_log()` only for unrecoverable conditions in dev paths. Never log secrets.
- JS: `console.error` for handled errors at module boundaries. No `console.log` in committed code.
