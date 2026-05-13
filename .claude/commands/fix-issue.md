---
description: "Pick up an issue: investigate, plan, test, implement, verify."
---

# /fix-issue — End-to-end issue workflow

## Goal
Given an issue number or description, deliver a complete fix with tests, lint, and a self-review.

## Inputs
- $ARGUMENTS: issue number (`#123`), issue URL, or free-form description.

## Procedure

1. **Understand the ask.**
   - If a number/URL: `gh issue view <num>` → read title, body, labels, comments.
   - Else: re-read $ARGUMENTS, ask 1–2 sharp clarifying questions if requirements are unclear.

2. **Locate.**
   - Identify the area: project, task, milestone, comment, settings, integrations (github/loom/notion), my-tasks, discussions.
   - Backend path: `src/<Feature>/Controllers/`, `routes/<feature>.php`, `src/<Feature>/Models/`, `src/<Feature>/Transformers/`.
   - Frontend path: `views/assets/src/components/<area>/`, `views/assets/src/store/<area>Slice.js`, `views/assets/src/hooks/`.
   - Use `Explore` agent for >3-file searches; otherwise grep directly.

3. **Reproduce mentally first.**
   - Trace the path: UI → useApi → route → controller → model → transformer → response → slice → UI.
   - Identify the exact line(s) where behavior diverges.

4. **Plan.**
   - Write a 3–7 step plan as TodoWrite items. Smallest viable change first.
   - Flag anything that crosses the Free/Pro boundary (`window.PM`).

5. **Write tests first when behavior is observable.**
   - Backend behavior: Codeception unit/functional in `tests/unit/` or `tests/functional/`.
   - UI behavior: Playwright spec under `tests/e2e-playwright/`.
   - Pure helpers: prefer unit test.

6. **Implement.**
   - Follow `.claude/rules/` (code-style, php-backend, react-frontend, api-conventions).
   - Touch only what the issue requires. No drive-by refactors.
   - Add migration in `db/migrations/` for any schema change.

7. **Verify.**
   - `vendor/bin/phpcs <changed-files>` for PHP
   - `pnpm lint` for JS
   - `vendor/bin/codecept run` for the suite that covers the area
   - `pnpm build` to confirm bundle compiles
   - If UI change: `pnpm dev`, manually open WP admin → relevant screen → exercise the flow.

8. **Self-review.**
   - Run `/review` mentally against the diff.
   - Confirm critical paths still work (see CLAUDE.md "Critical Paths").

9. **Summarize.**
   - 2-line summary: what changed, why.
   - List touched files.
   - Note any follow-ups intentionally deferred.

## Output
Branch ready to commit, with test + impl + verification log.
