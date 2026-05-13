# PHP Backend Rules

## Routes

- File: `routes/<feature>.php`. Auto-loaded by `bootstrap/loaders.php :: wedevs_pm_load_routes()`.
- Use the singleton router:
  ```php
  $wedevs_pm_router = WeDevs\PM\Core\Router\Router::singleton();
  ```
- Method binding via `Controller@method` STRING:
  ```php
  $wedevs_pm_router->post( 'projects/{project_id}/tasks',
      'WeDevs/PM/Task/Controllers/Task_Controller@store' )
      ->permission([ 'WeDevs\PM\Core\Permissions\Create_Task' ])
      ->validator( 'WeDevs\PM\Task\Validators\Create_Task' )
      ->sanitizer( 'WeDevs\PM\Task\Sanitizers\Task_Sanitizer' );
  ```
- **Always** chain `->permission([...])`. **Always** chain validator + sanitizer for POST/PUT.
- Path placeholders: `{project_id}`, `{task_id}`, etc. — kebab-free, snake_case.

## Permissions

- `core/Permissions/<Name>.php` — class with `public function can(): bool`.
- 29 classes exist. Reuse before writing new.
- Resolve `project_id` defensively: `intval( $_REQUEST['project_id'] ?? 0 )`.
- Use existing role/capability lookups (`wp_pm_roles`, `wp_pm_capabilities`, `wp_pm_role_users`, `wp_pm_role_projects`).
- Return strictly bool — no truthy strings.

## Controllers

- Path: `src/<Feature>/Controllers/<Feature>_Controller.php`.
- Singleton pattern used in existing controllers (`getInstance()`) — match.
- Use traits where existing controllers do: `Transformer_Manager`, `Request_Filter`, `Last_activity`.
- Method signature accepts `WP_REST_Request $request`.
- Sequence: **sanitize → validate (already by router) → query/mutate → fire action → transform → return**.
- Return Fractal output — NEVER `wp_send_json` directly:
  ```php
  return fractal()
      ->item( $task )
      ->transformWith( new Task_Transformer )
      ->includeData()
      ->toArray();
  ```

## Eloquent Models

- Path: `src/<Feature>/Models/<Model>.php`.
- Extend `WeDevs\WeDevsORM\Eloquent\Model` (via `tareq1988/wp-eloquent`).
- Properties: `$table` (no prefix — Eloquent auto-prefixes), `$fillable`, `$casts`, `$dates`.
- Relations: `hasMany`, `belongsTo`, `belongsToMany`, `morphMany`.
- Use `whereHas` / `whereDoesntHave` for relation predicates — not raw LEFT JOIN.

## Transformers

- Path: `src/<Feature>/Transformers/<Name>_Transformer.php`, extends `League\Fractal\TransformerAbstract`.
- Cast types in the array (`(int)`, `(bool)`, `->toISOString()`).
- Declare `$availableIncludes` for opt-in relations.
- `includeX` methods return `$this->collection|item($related, new X_Transformer)`.
- Frontend opts in via `?with=relation1,relation2`. **Never** `?include=`.

## Migrations

- Path: `db/migrations/<name>.php`.
- Append-only. Never edit a shipped migration.
- Idempotent: check for column existence before ALTER.
- Update `db/Create_Table.php` for fresh installs.
- Trigger: deactivate + reactivate, or `(new Migrater)->build_schema()`.

## Sanitization

- `sanitize_text_field` — plain text fields.
- `wp_kses_post` — rich text (comments, task descriptions).
- `intval` — integer params (IDs, status).
- `esc_url_raw` — URLs going into DB.
- `sanitize_email` — emails.
- `wp_unslash` BEFORE other sanitization on `$_POST`/`$_REQUEST` values.

## Output escaping

- All output that hits the DOM via PHP-rendered templates (`views/`, emails) must be escaped:
  - `esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`.
- React handles its own escaping. PHP-side `wp_send_json` does too.

## SQL safety

- Never concatenate user input into a query.
- Use `$wpdb->prepare` for raw queries.
- Use Eloquent bindings for everything else.

## WordPress integration

- Hooks: `do_action('pm_<event>')`, `apply_filters('pm_<filter>')`.
- Capabilities: prefer permission classes; use `current_user_can('manage_options')` ONLY for true admin-only paths (settings UI).
- `wp_send_json_*` only for legacy endpoints; new endpoints use Fractal.
