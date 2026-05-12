---
name: "security-review"
description: "Scan PHP + React changes in WP Project Manager for the security issues common to WordPress plugins: nonce/permission bypass, unsanitized input flowing to wp_send_json or echo, SQL injection in raw $wpdb queries, XSS via dangerouslySetInnerHTML, SVG upload bypass, missing capability checks on AJAX/REST routes, leaked secrets in JS bundle, broken CSRF protection. TRIGGER when the user says 'security review', 'audit for vulns', 'scan the diff', invokes /security-review, or asks 'is this safe'. Also trigger automatically when reviewing any change that touches routes/, core/Permissions/, db/, or files that handle uploads."
---

# WP Project Manager Security Review

## Scope
PHP backend, React frontend, and the bridge between them. Stack-specific threat model — WordPress plugin distributed via wp.org SVN. Untrusted input = anything from `$_REQUEST`, `WP_REST_Request`, browser, or third-party APIs (GitHub/Loom/Notion previews).

## Workflow

1. **Determine diff scope.**
   - If a PR is named, `gh pr diff <N>`.
   - Else `git --no-pager diff HEAD`.
   - List changed files; for any in the high-risk paths below, read the FULL file (not just hunks).

2. **High-risk paths** (always read in full when changed):
   - `routes/*.php` — endpoint surface
   - `core/Permissions/*.php` — authz
   - `db/Create_Table.php`, `db/migrations/*` — schema
   - `src/*/Controllers/*.php` — request handling
   - `bootstrap/loaders.php` — SVG sanitization, plugin boot
   - `views/assets/src/hooks/useApi.js` — auth wiring
   - `views/assets/src/index.jsx` — `window.PM` exposure
   - Anything mentioning `wp_send_json`, `dangerouslySetInnerHTML`, `$wpdb->query`, `eval`, `unserialize`, `file_get_contents`, `wp_remote_*`

3. **Check each issue. For every finding:** `file:line — [SEVERITY] threat — remediation`.

### Authz / permission
- Every route in `routes/*.php` chains `->permission([...])` with a class from `core/Permissions/`.
- For mutation routes (POST/PUT/DELETE): the permission must check the resource owner / project membership (`Access_Project`, `Edit_Task`, etc.), not just `Authentic`.
- New permission classes return strict bool from `can()`.
- No `current_user_can` inlined in controllers as the only gate (it bypasses the router's chain and is easy to miss).
- `is_admin` request param is a hint, NOT a trust boundary — never make decisions based solely on it.

### Input sanitization
- All `$request->get_param(...)` results sanitized before SQL/output:
  - `sanitize_text_field` for plain text
  - `intval` / `absint` for IDs and integers
  - `wp_kses_post` for rich text (comments, task descriptions)
  - `esc_url_raw` for URLs
  - `sanitize_email` for emails
- `wp_unslash` before sanitizing `$_POST` / `$_REQUEST`.
- Arrays sanitized recursively — `array_map('intval', $ids)`, not a bare assignment.

### SQL injection
- Eloquent: bindings cover it. Flag raw concatenation into `whereRaw`.
- `$wpdb->query` / `$wpdb->get_var` / `$wpdb->get_results`: MUST use `$wpdb->prepare` with placeholders for any variable.
- Migration ALTER statements may be raw — verify the schema string is a literal, not interpolated user data.

### XSS
- Backend: PHP-rendered templates (`views/emails/`, `views/project-switch/`) must escape every echo: `esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`.
- Frontend:
  - `dangerouslySetInnerHTML` ONLY when wrapped in `sanitizeHtml` from `@lib/sanitize` (DOMPurify-based).
  - Pusher notification handler (`index.jsx`) strips inline `style="…"` and sanitizes — match that pattern.
  - No `eval`, no `new Function`, no `document.write`.

### CSRF / nonce
- Frontend: `useApi.js` injects `X-WP-Nonce: PM_Vars.permission`. Custom fetch callers must also include it.
- Backend: nonce verified by the router. If a new code path bypasses the router (e.g., `add_action('wp_ajax_*')`), it MUST verify nonce explicitly.

### File uploads / SVG
- SVG sanitization wired via `bootstrap/loaders.php :: wedevs_pm_clean_svg()`. Any new upload path must funnel through `wp_check_filetype_and_ext` or call the sanitizer directly.
- File path handling: never concatenate user input into a filesystem path; use `wp_unique_filename`, `wp_check_filetype`, `path_join` with `WP_CONTENT_DIR`.

### Secrets in client
- The React bundle is public. Anything in `PM_Vars` is public.
- Flag any API keys / tokens that look like they're being injected into `PM_Vars`. AI/integration tokens (OpenAI, GitHub, Notion, Loom) must stay server-side and be referenced by ID, not value.

### Third-party preview APIs
- `src/GitHub/`, `src/Loom/`, `src/Notion/`, `src/Trello/` make outbound calls.
- Always `wp_remote_get`/`wp_remote_post` with `sslverify => true`, sane timeout.
- Validate the response shape before rendering — never pipe a third-party URL into `<a href>` or `<img src>` without `esc_url`/`sanitize_url`.

### Window.PM exposure
- `window.PM` is intentionally public — Pro needs it. But avoid exposing:
  - Direct DB connection refs
  - Internal helpers that mutate state without the same authz as the API path
  - Anything that lets callers bypass `useApi.js`'s nonce/is_admin injection

### Mass assignment / overposting
- Eloquent `$fillable` lists must not include privileged fields (`is_admin`, capability flags, internal status fields).
- `update($request->all())` is a smell — always `update($validated_fields_only)`.

### Output of error details
- Don't return stack traces / Eloquent error messages to clients. Wrap in `WP_Error` with a generic message; log details server-side.

### Open redirects
- Any `wp_safe_redirect` target derived from `$_REQUEST` must be validated against `wp_validate_redirect`.

## Severity guide
- **CRITICAL** — authz bypass, unauthed RCE/SQLi/XSS, secret leak in bundle.
- **HIGH** — XSS requiring auth, CSRF on mutation, missing nonce, mass assignment.
- **MEDIUM** — missing sanitization without confirmed sink, weak validation, missing rate limit.
- **LOW** — defense-in-depth, hardening suggestions, missing helmet-equivalent headers.

## Output format

```
## Security review of <branch | PR #N>

### Critical
- file:line — [CRITICAL] ... — fix: ...

### High
- file:line — [HIGH] ... — fix: ...

### Medium / Low
- ...

### Clean areas
- ...
```

## Gotchas specific to this codebase
- `PM_Vars.permission` (not `.nonce`) is the nonce. Don't "fix" it.
- `is_admin` is a request param, NOT a permission boundary.
- The custom router is in `core/Router/` — WP REST API security advice doesn't always map cleanly. The router enforces nonce; new code that bypasses it loses that protection.
- `compatibility-checker.php` is legacy admin-notice code; don't add new public surface there.
