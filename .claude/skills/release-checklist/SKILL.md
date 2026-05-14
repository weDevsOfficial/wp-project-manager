---
name: "release-checklist"
description: "Pre-flight checklist before tagging a WP Project Manager release. Verifies version bumps, build, lint, POT regeneration, dist contents, changelog, readme stable tag, and Pro/Free compatibility. TRIGGER when the user says 'release', 'cut a release', 'ship it', 'prepare release', invokes /release-checklist, or mentions bumping the plugin version. Do NOT trigger for development builds."
---

# Release Checklist

Run BEFORE any tag/push. Stop at the first failure.

## 1. Version sync

The version must match in ALL of these:
- `cpm.php` plugin header `Version: X.Y.Z`
- `cpm.php` constant `define('PM_VERSION', 'X.Y.Z')`
- `package.json` `"version": "X.Y.Z"`
- `readme.txt` `Stable tag: X.Y.Z`

```bash
grep -n "Version:" cpm.php
grep -n "PM_VERSION" cpm.php
grep -n "\"version\":" package.json
grep -n "Stable tag" readme.txt
```

## 2. Changelog

- `changelog.txt` (top-level) has an entry for the new version dated today.
- `readme.txt` `== Changelog ==` section mirrors it.
- Entries describe user-visible changes, not internal refactors.

## 3. Lint clean

```bash
pnpm lint
vendor/bin/phpcs
```

Both must exit 0. Fix or document any new warnings.

## 4. Tests

```bash
vendor/bin/codecept run unit
vendor/bin/codecept run functional
cd tests/e2e-playwright && npx playwright test
```

Failures block release. Document any intentional skip in the PR / changelog.

## 5. i18n

```bash
pnpm makepot
```

- `languages/wedevs-project-manager.pot` updated.
- No fuzzy entries leaked (commit `806fad1a` reference).
- `.po` files for shipped locales re-built (`msgfmt`/`wp i18n make-json` if applicable).

## 6. Build

```bash
pnpm build
```

- Exits clean.
- `views/assets/dist/pm.js` and `pm.css` regenerated.
- No source maps in production (`.gitignore` excludes `*.map`).
- Bundle size sanity check — flag if `pm.js` jumped by >20% vs previous release.

## 7. Distignore audit

```bash
cat .distignore
```

Verify dev-only paths are excluded:
- `node_modules/`, `vendor/` (dev deps), `tests/`, `phpcs-xml/`, `composer-scripts/`
- `.github/`, `.claude/`, `CLAUDE.md`, `CLAUDE.local.md.example`
- `.editorconfig`, `.eslintrc*`, `.env*`
- `package.json`, `pnpm-lock.yaml`, `composer.json` (or whitelisted as needed)
- `Gruntfile.js`, `webpack.config.js`, `tailwind.config.js`, `postcss.config.js`, `jsconfig.json`

If `.claude/` or `CLAUDE.md` is NOT in `.distignore`, ADD them before release.

## 8. Free / Pro compatibility

- `window.PM` contract in `views/assets/src/index.jsx` is BACKWARD-COMPATIBLE vs the previous release. Diff vs last tag:
  ```bash
  git diff <last-tag> -- views/assets/src/index.jsx | grep -E "(registerSlot|registerFilter|injectReducer|window\.PM)"
  ```
- New fields are additive only. Renames or removals require coordinating with Pro repo (`../pm-pro/`).

## 9. Smoke test

- Build zip via `pnpm release` (Grunt).
- Install on a clean WP:
  - Plugin activates without notice
  - Project Manager → Projects page renders
  - Create a project → create a task → comment → all CRUD works
  - With Pro installed alongside: Pro tabs/slots still load
- Check `error_log` after smoke test — no warnings/notices.

## 10. Tag + push

Only after all checks pass AND user explicitly approves:

```bash
git tag vX.Y.Z
# DO NOT auto-push. Wait for user.
```

User runs `git push origin vX.Y.Z` themselves (pushes are denied in `.claude/settings.json`).

## 11. wp.org SVN

- `.github/workflows/assets-deploy.yml` pushes `.wordpress-org/` assets on push to `master`.
- The plugin code release to SVN trunk is a separate manual step — confirm with team.

## Stop signals

- Any test failing
- Lint errors
- `pnpm build` warning about React/Redux duplicates
- `vendor/bin/phpcs` reporting NEW violations vs last tag
- Bundle size +20% vs last tag
- `window.PM` shape regression
