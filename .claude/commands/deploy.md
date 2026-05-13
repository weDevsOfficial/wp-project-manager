---
description: "Build and package the plugin for release / wp.org deploy."
---

# /deploy — Release build

## Goal
Produce a production-ready zip and (optionally) push assets to wp.org. **Confirm with user before any push.**

## Inputs
- $ARGUMENTS: optional version string (e.g., `4.0.1`). If omitted, use current `PM_VERSION` from `cpm.php`.

## Procedure

1. **Pre-flight.**
   - Working tree clean? `git status --short` → must be empty.
   - On the intended release branch (typically `develop` or `master`)? Confirm with user.
   - `composer install --no-dev` succeeds.
   - `pnpm install` succeeds.

2. **Version bump (if $ARGUMENTS given).**
   - Update `PM_VERSION` in `cpm.php`
   - Update `Version:` plugin header in `cpm.php`
   - Update `Stable tag:` in `readme.txt`
   - Update `version` in `package.json`
   - Show diff. Get user confirmation before commit.

3. **Build.**
   - `pnpm lint` — must pass clean.
   - `vendor/bin/phpcs` on changed files — call out violations.
   - `pnpm makepot` — regenerate POT.
   - `pnpm build` — production bundle into `views/assets/dist/`.

4. **Package.**
   - `pnpm release` runs `grunt release --force` — produces `build/` dir + zip.
   - Inspect zip contents against `.distignore` to confirm dev files excluded.

5. **wp.org assets (optional, confirm with user).**
   - GitHub Action `.github/workflows/assets-deploy.yml` pushes `.wordpress-org/` to SVN on push to `master`.
   - For the actual plugin code release: weDevs uses SVN trunk — confirm before triggering.

6. **Tag + release.**
   - User confirms → `git tag v$VERSION`, then `git push origin v$VERSION` (requires explicit user OK; pushes are denied by default).

## Verification
- Install the produced zip on a clean WordPress to smoke-test activation.
- Open Project Manager → Projects list → render check.
- Re-confirm `PM_VERSION`, plugin header, and `readme.txt` Stable tag match.

## Notes
- `plugin-deploy.sh` is the legacy shell deploy script — review before reuse.
- Pro plugin lives separately at `../pm-pro/`. Its release is independent.
- TODO: confirm with team — current wp.org SVN credentials live in GitHub Actions secrets (`SVN_USERNAME`/`SVN_PASSWORD`).
