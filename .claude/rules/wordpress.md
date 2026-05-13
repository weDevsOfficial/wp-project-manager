# WordPress Integration Rules

## Hooks

### Action names

Plugin actions follow `pm_<verb>_<noun>` or `wedevs_pm_<event>`:

```
wedevs_pm_loaded                — fires once all plugin bootstrapping is done
pm_after_new_task               — after a task is created
pm_after_update_task            — after a task is updated
pm_after_new_project            — after a project is created
pm_slot_registered              — when a frontend Slot is registered (by Pro)
```

Fire actions in controllers AFTER the mutation succeeds and BEFORE the response is transformed.

### Filter names

```
pm_apply_filters                — generic filter (legacy)
```

Prefer dedicated, well-named filters over a single mega-filter.

## Capabilities

- Pure WP admin paths (settings UI): `current_user_can('manage_options')`.
- All other authz: a permission class in `core/Permissions/`.
- The custom Role/Capability tables (`wp_pm_roles`, `wp_pm_capabilities`, `wp_pm_role_users`, `wp_pm_role_projects`) supplement WP roles — managed by `src/Role/`.

## Nonces

- New endpoints: rely on the router's nonce check (`X-WP-Nonce: PM_Vars.permission`).
- AJAX-style legacy callbacks (if any): `check_ajax_referer( '<action>', '_wpnonce' )`.

## SVG safety

`bootstrap/loaders.php :: wedevs_pm_clean_svg()` hooks `wp_check_filetype_and_ext` and runs the SVG through `enshrined/svg-sanitize`. Don't add a second SVG path that bypasses it.

## Assets

- Frontend bundle enqueued via `WeDevs\PM\Core\WP\Frontend` (in `core/WP/`).
- Custom mount point: `<div id="wedevs-pm"></div>` (or `<div id="<PM_Vars.id>"></div>` if customized).
- jQuery is still loaded by WP — used for some legacy paths. Don't depend on it for new code, but don't try to dequeue it either.

## Database

- Tables prefixed by `wp_pm_*` (after `$wpdb->prefix`).
- `wp_pm_meta` is a generic meta table used by multiple resources.
- Multisite: Pro plugin handles per-blog activation (`wp_initialize_site` hook). Free plugin assumes single site; migrations should still be idempotent.

## Compatibility

- `compatibility-checker.php` is a legacy admin notice / guard. Don't edit without intent.
- Minimum PHP: `7.2` per `composer.json` (`cpm.php` itself bails below `5.6` — historical).

## Plugin entry sequence

`cpm.php` → defines constants → `bootstrap/loaders.php` → `libs/configurations.php` → `compatibility-checker.php` → `bootstrap/start.php` → fires `wedevs_pm_loaded`. Order matters — don't reshuffle.

## Output

- Server-rendered templates in `views/emails/`, `views/project-switch/`.
- Always escape: `esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`.

## Updates / tracking

- `appsero/client` (insights) wired in `wedevs_pm_init_tracker()` — opt-in.
- Don't add new outbound calls without a user opt-in surface.
