---
name: wepm-release
description: Release a new version of wedevs-project-manager (Project Manager free) to wp.org via GitHub Actions (`.github/workflows/deploy-org.yml`). Tag push triggers the deploy workflow — no Appsero. Trigger when user says "release wepm", "release project manager", "ship pm X.Y.Z", "publish wedevs project manager", "/wepm-release".
---

# Project Manager (Free) Release Skill

Workflow-driven release for `wedevs-project-manager`. Pushing tag `vX.Y.Z` triggers `.github/workflows/deploy-org.yml`, which builds with pnpm + composer and deploys to wp.org SVN via `10up/action-wordpress-plugin-deploy`.

**No Appsero. No git-flow. No release branches. Just commit + tag + push.**

## TL;DR

```bash
wepm-release 4.0.1
# → prompts: 'Tested up to' WP version (default = latest)
# → prompts: changelog entries (or pass --changelog-file)
# → bumps versions, commits, tags, pushes
# → tag push triggers deploy-org.yml → builds zip → deploys to wp.org
```

That's it. **All steps automated.**

For pre-generated changelog (recommended when the skill agent drafts it):
```bash
wepm-release 4.0.1 --changelog-file /tmp/wepm-changelog.md
```

For fake-test against a fork:
```bash
wepm-release 3.0.7 --repo git@github.com:arifulhoque7/wp-project-manager.git
```

### Flags

| Flag | Default | Purpose |
|------|---------|---------|
| `--repo URL` | weDevsOfficial | Source repo to clone + push to |
| `--branch NAME` | develop | Branch to release from |
| `--remote NAME` | origin | Remote name for push |
| `--changelog-file PATH` | _interactive_ | Pre-generated changelog entries (one per line) |
| `--wp-tested X.Y` | _prompt_ | Skip 'Tested up to' prompt with explicit value |
| `--no-clone` | _clone_ | Operate on current dir instead of fresh clone |
| `--skip-build` | _build_ | Skip local pnpm/composer/zip build (also skips GitHub Release since no zip) |
| `--skip-push` | _push_ | Stop before pushing — also skips GitHub Release |
| `--skip-release` | _release_ | Stop before creating GitHub Release |
| `-y`, `--yes` | _prompt_ | Auto-accept all confirmation prompts |

## When to Use

User wants to ship Project Manager (free) version. Match phrases:
- `release wepm 4.0.1`
- `ship project manager next version`
- `publish wedevs-project-manager X.Y.Z`
- `/wepm-release`

**Do NOT use for:** Pro plugin, code review, hotfixes that don't bump version.

## What `wepm-release` does

Single command. Orchestrates entire pipeline:

1. **Pre-flight** — verifies `git`, `gh`, `node`, `curl`, `awk`, `sed` (always); plus `pnpm`, `composer`, `zip`, `rsync` if building (pass `--skip-build` to skip).
2. **Fresh-clones** repo into `~/Sites/wepm-release/wp-project-manager` (default branch `develop`). Pass `--no-clone` to operate on current directory.
3. **Verifies push perm** via gh API.
4. **Prompts for 'Tested up to' WP version** (auto-fetches latest from wordpress.org API as default).
5. **Reads changelog** from `--changelog-file FILE` if provided, else prompts interactively (one entry per line, empty line to finish).
6. **Shows preview** and asks confirmation.
7. **Bumps versions**:
   - `cpm.php` — `Version:` header + `define('PM_VERSION', '…')` constant
   - `readme.txt` — `Stable tag:` + `Tested up to:`
   - `package.json` — `version` field
8. **Inserts changelog block** at top of `readme.txt` and `changelog.txt` (after `== Changelog ==` line).
9. **Shows diff + final confirmation.**
10. **Commits**: `chore: bump version to X.Y.Z`
11. **Tags**: annotated `vX.Y.Z` with message `release version X.Y.Z`
12. **Builds zip locally** (`--skip-build` to skip):
    - `pnpm install --frozen-lockfile`
    - `pnpm run build`
    - `pnpm run makepot` (if wp-cli available)
    - `composer install --no-dev --optimize-autoloader`
    - `rsync` staging via `.distignore`
    - `zip` → `build/wedevs-project-manager-vX.Y.Z.zip`
    - restores composer dev deps after
13. **Pushes** branch + tag to remote (default `origin`). Pass `--skip-push` to stop before push.
14. **Creates GitHub Release** `vX.Y.Z` with the local zip + changelog notes (`--skip-release` to skip).
15. **Tag push fires `deploy-org.yml`** on GitHub — Actions builds and deploys to wp.org SVN (independent of the local zip / GitHub Release).

Total time: ~2 min interactive + ~3-5 min local build + ~3-5 min CI build + SVN deploy.

The **local zip** (in GitHub Release) and the **wp.org zip** (built by 10up action) are independent: wp.org is authoritative for end users; the GitHub Release zip is a convenience archive.

## File locations

| Path | Purpose |
|------|---------|
| `~/wepm-release.sh` | Orchestrator (canonical install location, matches WPUF `~/wpuf-release-free.sh` pattern) |
| `~/Sites/wepm-release/wp-project-manager/` | Fresh clone workspace (created/destroyed each run) |
| `~/.zshrc` | `alias wepm-release='~/wepm-release.sh'` (recommended) |

## Setup (one-time per machine)

### Required tools

```bash
which git gh node curl awk sed
gh auth status              # Must show logged in
```

### Alias (recommended)

```bash
echo "alias wepm-release='~/wepm-release.sh'" >> ~/.zshrc
```

Open new terminal to pick up.

### Push permission

```bash
gh api repos/weDevsOfficial/wp-project-manager/collaborators/$(gh api user --jq .login)/permission --jq .role_name
```

Need at least `write` to push branch + tag. If `develop` is protected: get bypass from `tareq1988` or `nizamuddinbabu`.

## Agent flow — drafting the changelog

When the user invokes this skill, the agent should generate the changelog (not delegate to the interactive prompt) for higher quality, user-centric entries.

**Steps:**

1. **Find last tagged commit on the target branch:**
   ```bash
   git -C ~/Sites/wepm-release/wp-project-manager describe --tags --abbrev=0
   # or
   git ls-remote --tags origin | awk -F/ '{print $NF}' | grep -E '^v[0-9]' | sort -V | tail -1
   ```
2. **Inspect commits since last tag:**
   ```bash
   git log v<last>..HEAD --no-merges --pretty='format:%h %s'
   git log v<last>..HEAD --no-merges -- '*.php' '*.ts' '*.tsx' '*.vue'
   gh pr list --repo weDevsOfficial/wp-project-manager --state merged --base develop --limit 30 --json number,title,labels
   ```
3. **Categorize into user-facing buckets:**
   - `**New:**` — new features / additions
   - `**Improved:**` — enhancements to existing behavior, UI polish, perf
   - `**Fixed:**` — bug fixes, security patches
   - `**Update:**` — meta/compat changes (e.g. tested with WP X.Y, PHP support)
4. **Rewrite each entry user-centric:**
   - Bad: `Refactor task list rendering for performance`
   - Good: `**Improved:** Task lists render faster on projects with many tasks.`
   - Skip dev-only commits (chore, lint, refactor without observable impact).
5. **Write block to a temp file:**
   ```
   **New:** Description.
   **Improved:** Description.
   **Fixed:** Description.
   ```
   (one entry per line, no header — script wraps with `= vX.Y.Z – Mon D, YYYY =`)
6. **Pass via `--changelog-file`:**
   ```bash
   wepm-release X.Y.Z --changelog-file /tmp/wepm-changelog.md
   ```
7. **Walk user through prompts** (only 'Tested up to' + confirmations).

## Example prompts → expected behavior

### Example 1: standard chore release

**User says:** `release wepm 4.0.1 with this change: bump Tested up to 6.9.5`

**Agent does:**
1. Verifies pre-reqs (env tools, gh auth).
2. Asks: "Generate changelog from commits since v4.0.0, or do you have a specific entry?"
3. If specific: writes provided entry to `/tmp/wepm-changelog.md`:
   ```
   **Update:** Tested up to WordPress 6.9.5.
   ```
4. Runs: `wepm-release 4.0.1 --changelog-file /tmp/wepm-changelog.md`
5. Tells user: "Tag pushed. Workflow at <URL>. Watch with `gh run watch`."

### Example 2: bundled feature release

**User says:** `release wepm 4.1.0 — bunch of UI fixes plus the new shortcode feature`

**Agent does:**
1. `git log v4.0.0..HEAD --no-merges --pretty=format:'%h %s'` in fresh clone.
2. Reviews ~20 commits, picks user-facing ones, categorizes.
3. Drafts changelog like:
   ```
   **New:** Shortcode support for embedding project views on any page.
   **Improved:** Task list layout adapts better to smaller screens.
   **Improved:** File preview now supports more image formats.
   **Fixed:** Sidebar collapse state persists across page loads.
   **Fixed:** My Tasks tab shows correct task count when filtered.
   ```
4. Shows draft, asks user to confirm/edit.
5. Runs: `wepm-release 4.1.0 --changelog-file /tmp/wepm-changelog.md`

### Example 3: fake-test against fork

**User says:** `do a fake release with version 3.0.7 to test the workflow`

**Agent does:**
1. Confirms target fork URL.
2. Runs: `wepm-release 3.0.7 --repo git@github.com:<user>/wp-project-manager.git`
3. Tag pushes to fork → fork's Actions run (in dry-run mode or no SVN secrets = safe).
4. Reports workflow URL for monitoring.

### Example 4: dry-run before pushing

**User says:** `prepare 4.0.1 but don't push yet, I want to review first`

**Agent does:**
1. Runs: `wepm-release 4.0.1 --skip-push`
2. Reports commit + tag created locally. Hands off commands to push manually.

## Critical workflow detail

`.github/workflows/deploy-org.yml` triggers on **any tag push** (`tags: ['*']`). It:

1. Checks out the tagged commit
2. `pnpm install --frozen-lockfile` + `pnpm run build`
3. `pnpm run makepot` (POT generation)
4. `composer install --no-dev --optimize-autoloader`
5. Builds zip via `10up/action-wordpress-plugin-build-zip` (uses `.distignore`)
6. Deploys via `10up/action-wordpress-plugin-deploy` with SVN secrets

If the workflow has `dry-run: true` on the deploy step, no SVN write happens — useful for testing.

**Required secrets on repo:**
- `SVN_USERNAME` (wp.org username)
- `SVN_PASSWORD` (wp.org password)

**No secrets configured = workflow fails at deploy step** (safe for fake tests on a fork).

## ⚠️ Don't

- DO NOT release more than once per 24h (wp.org indexer rate-limits — bundle multiple changes into one release).
- DO NOT push to `master` — the workflow tag-triggers, no need for the branch.
- DO NOT delete published tags on `weDevsOfficial/wp-project-manager` (re-running the workflow will fail; tag is wp.org's permanent reference).
- DO NOT skip the `Stable tag` bump in `readme.txt` — wp.org rejects deploys where `Stable tag` ≠ tag name.
- DO NOT run from a dirty working tree (script aborts unless `--no-clone` is used carefully).
- DO NOT force-push tags.

## Troubleshooting

### Workflow run shows "Stable tag mismatch" or "Tag already exists"

`readme.txt` `Stable tag:` doesn't match the pushed tag. Verify with:
```bash
git show v<X.Y.Z>:readme.txt | grep 'Stable tag'
```

### Workflow's `10up/action-wordpress-plugin-deploy` step fails on auth

`SVN_USERNAME` / `SVN_PASSWORD` secrets missing on repo. Set via:
```bash
gh secret set SVN_USERNAME --repo weDevsOfficial/wp-project-manager
gh secret set SVN_PASSWORD --repo weDevsOfficial/wp-project-manager
```

### Zip leaks `.claude/`, `node_modules/`, or other dev artifacts

Edit `.distignore` to add the path. Re-tag (or delete tag + re-push to fork for test).

### wp.org page stuck on old version after workflow success

SVN may be correct but API cached. Check:
```bash
curl -sI "https://plugins.svn.wordpress.org/wedevs-project-manager/tags/X.Y.Z/" | head -1
curl -s "https://plugins.svn.wordpress.org/wedevs-project-manager/trunk/readme.txt" | grep 'Stable tag'
curl -s "https://api.wordpress.org/plugins/info/1.0/wedevs-project-manager.json" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('version'),d.get('last_updated'))"
```

If SVN correct but API stale: wait 15-60 min. If > 2 hours: email `plugins@wordpress.org`.

### Tag push rejected (protected branch / GH006)

Branch protection rule on `develop`. Get a bypass collaborator role from `tareq1988` or `nizamuddinbabu`. OR push directly to a release/* style branch first, then tag.

## Step-by-step (manual fallback if script broken)

```bash
# 1. Fresh clone
mkdir -p ~/Sites/wepm-release && cd ~/Sites/wepm-release
rm -rf wp-project-manager
git clone --branch develop git@github.com:weDevsOfficial/wp-project-manager.git
cd wp-project-manager

# 2. Manually edit:
#    - cpm.php       : Version: X.Y.Z + define('PM_VERSION', 'X.Y.Z')
#    - readme.txt    : Stable tag + Tested up to + new changelog block
#    - changelog.txt : new changelog block at top
#    - package.json  : version field

# 3. Commit + tag + push
git add cpm.php readme.txt changelog.txt package.json
git commit -m "chore: bump version to X.Y.Z"
git tag -a vX.Y.Z -m "release version X.Y.Z"
git push origin develop
git push origin vX.Y.Z

# 4. Watch workflow
gh run watch --repo weDevsOfficial/wp-project-manager
```

## Repo facts (cached)

- Repo: `weDevsOfficial/wp-project-manager`
- Default branch: `develop`
- Wp.org slug: `wedevs-project-manager` (not the repo name!)
- Wp.org URL: https://wordpress.org/plugins/wedevs-project-manager/
- SVN URL: https://plugins.svn.wordpress.org/wedevs-project-manager/
- Tag format: `vX.Y.Z`
- Deploy: `.github/workflows/deploy-org.yml` (10up/action-wordpress-plugin-deploy)
- Build: pnpm 9 + Node 22 + PHP 7.4 + Composer
- Main plugin file: `cpm.php`
- Version constants: `Version: X.Y.Z` header (line 8) + `define('PM_VERSION', 'X.Y.Z')` (line 19)
- Build excludes: `.distignore`
- Changelog format: `= vX.Y.Z – Mon D, YYYY =` then `**Type:** Description` lines

## Changelog format (matters!)

Format is the bold-prefix style, **not** the asterisk-prefix style used in WPUF:

```
= v4.0.1 – May 13, 2026 =

**New:** Description of new feature.
**Improved:** Description of improvement.
**Fixed:** Description of bug fix.
**Update:** Description of meta/compat change.
```

NOT:
```
* New – Description     ← WPUF style, do not use here
```

When the user provides changelog entries, accept either style but normalize to the bold-prefix on insertion. Reference: commit `970790e7` for the v4.0.0 example.

## Verified releases via this flow

| Version | Date | Status | Repo |
|---------|------|--------|------|
| _none yet_ | — | — | — |
