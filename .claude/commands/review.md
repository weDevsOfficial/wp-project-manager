---
description: "Review staged changes or a PR against WP Project Manager standards."
---

# /review — Review changes against WP-PM standards

## Goal
Audit the current diff (staged + unstaged, or a specified PR) for compliance with this plugin's conventions. Report blockers, suggestions, and nits. Do NOT make edits.

## Inputs
- $ARGUMENTS: optional PR number (`gh pr view <num>`) or commit range. Default: `git diff HEAD`.

## Procedure

1. Determine the diff source:
   - If $ARGUMENTS looks like a PR number → `gh pr diff $ARGUMENTS`
   - Else → `git --no-pager diff HEAD` and also `git status --short`
2. List changed files. For each significant file, read it in full (not just the diff hunks).
3. Check each item below. For every issue, output: `file:line — [SEVERITY] description — fix.`

### Backend (PHP) checks
- New route in `routes/*.php`?
  - Has `->permission([...])` with at least one permission class
  - For POST/PUT: `->validator(...)` AND `->sanitizer(...)`
- Controller method:
  - Sanitizes every `$request->get_param(...)` with `sanitize_text_field`, `intval`, `wp_kses_post`, etc.
  - Returns Fractal output via `fractal()->item|collection(...)`, NOT raw `wp_send_json`
  - Fires action hooks for cross-cutting concerns: `pm_after_new_task`, `pm_after_update_task`, etc.
- Eloquent queries:
  - Uses `whereHas` / `whereDoesntHave`, not raw LEFT JOIN for "missing relation" checks
  - `paginate()` for list endpoints
- Permission class:
  - Has `can()` method returning bool
  - No `current_user_can` inlined in controllers
- DB changes go through a NEW file in `db/migrations/`, NEVER edit a shipped migration
- i18n: text domain literal `'wedevs-project-manager'` (never a variable)

### Frontend (React) checks
- All API calls via `hooks/useApi.js` — no raw `fetch(`
- Uses `X-WP-Nonce: PM_Vars.permission` (auto-handled by useApi — flag if bypassed)
- Sends `is_admin` on every request
- Fractal includes via `?with=`, not `?include=`
- Task status sent as INTEGER (0/1), project status as STRING
- User attach/detach as comma-separated STRING
- Task assignees on update: full array (partial replaces — flag if partial)
- CSS isolation:
  - New classes prefixed `pm-`
  - No banned WP names: `.button .active .modal .form .card .table .spinner .notice .header`
  - Portaled Radix elements target `#pm-portal-root`
  - Z-index ≤ 700
- shadcn/ui primitives used where applicable (Button/Sheet/Dialog/…)
- Redux: async work via `createAsyncThunk`, UI state via `useState`
- Pro gating: `PM_Vars.is_pro` check or `<ProGate />`
- `.jsx` (not `.tsx`) — match existing tree
- New components export typed-shape via JSDoc when public

### Free ↔ Pro bridge
- Anything added to `window.PM` in `views/assets/src/index.jsx` is a contract — flag breakage
- Pro should NEVER import Free's internals directly — must go through window.PM
- Shared libs (React, react-redux, react-router-dom, sonner, Radix) MUST be webpack-externalized in Pro

### General
- No `console.log` left over (allow `console.error` for handled paths)
- No commented-out code blocks
- New PHP files: copyright header + namespace + `if ( ! defined('ABSPATH') ) exit;` when top-level
- Tests added/updated for non-trivial changes
- `phpcs.xml.dist` would still pass — call out new violations
- ESLint would still pass

## Output format

```
## Review of <branch | PR #N>

### Blockers
- file:line — [BLOCK] …
### Issues
- file:line — [ISSUE] …
### Nits
- file:line — [NIT] …
### Good
- …
```

## Verification
- Run `vendor/bin/phpcs <changed-files>` if any PHP changed (read-only check)
- Run `pnpm lint` if any JS changed (read-only check)
