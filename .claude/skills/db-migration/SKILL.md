---
name: "db-migration"
description: "Add a new append-only database migration for WP Project Manager. Updates db/migrations/, db/Create_Table.php, the Eloquent model fillable/casts, and the Fractal transformer. TRIGGER when the user says 'add a column', 'new table', 'schema change', 'migration', 'alter wp_pm_*', invokes /db-migration, or describes a feature that requires a DB change."
---

# DB Migration

## When to use this skill

Any schema change to a `wp_pm_*` table OR a new `wp_pm_*` table. NEVER edit a shipped migration or rewrite history.

## Procedure

1. **Audit existing migrations.**
   ```
   ls db/migrations/
   ```
   Note the naming convention used (timestamp, version-prefix, or sequential). Match it.

2. **Confirm the change is forward-only.**
   - Adding a column: OK.
   - Adding a table: OK.
   - Adding an index: OK.
   - Renaming a column: forbidden in one step. Multi-step: add new + dual-write + backfill + drop old (separate releases).
   - Dropping a column: requires explicit user approval.

3. **Write the migration file.** Template:
   ```php
   <?php
   global $wpdb;

   $table   = $wpdb->prefix . 'pm_tasks';
   $charset = $wpdb->get_charset_collate();

   // Idempotent: check before ALTER
   $col_exists = $wpdb->get_var( $wpdb->prepare(
       "SHOW COLUMNS FROM {$table} LIKE %s", 'priority'
   ) );

   if ( ! $col_exists ) {
       $wpdb->query( "ALTER TABLE {$table}
           ADD COLUMN `priority` VARCHAR(20) NOT NULL DEFAULT 'normal'
           AFTER `status`" );
   }
   ```
   - Always check existence — migrations may re-run on reactivation.
   - Use `$wpdb->prefix . 'pm_<table>'`.
   - Use `$wpdb->get_charset_collate()` for new tables.

4. **Update `db/Create_Table.php`** so fresh installs include the column/table.

5. **Update the Eloquent model** in `src/<Feature>/Models/`:
   - Add to `$fillable`
   - Add to `$casts` (`'priority' => 'string'`, `'estimation' => 'integer'`)
   - Add to `$dates` if it's a datetime column

6. **Update the transformer** in `src/<Feature>/Transformers/`:
   ```php
   return [
       // ...
       'priority' => (string) $task->priority,
   ];
   ```

7. **Update validators/sanitizers** if the new field is user-writable:
   - `src/<Feature>/Validators/` — enforce shape
   - `src/<Feature>/Sanitizers/` — coerce/clean

8. **Frontend integration:**
   - Slice: extend the thunk payload type.
   - Components: surface the new field in the relevant UI.
   - Don't break existing consumers — if the field is optional, default sensibly.

9. **Test.**
   - Deactivate + reactivate the plugin (triggers `wedevs_pm_migrate_db`).
   - Confirm:
     - New install: column present, default applied
     - Upgrade: existing rows get the default
     - Re-activation: migration is no-op
   - Codeception unit test on the model with the new field.

## Data types — table-wide conventions

| Column kind | MySQL type | Notes |
|---|---|---|
| Status (task) | TINYINT(1) | 0/1 only |
| Status (project) | VARCHAR(20) | incomplete/complete/archived/favourite |
| Title / name | VARCHAR(255) | |
| Description / rich text | LONGTEXT | |
| Duration / estimation | INT | seconds |
| Foreign IDs | BIGINT UNSIGNED | matches `wp_users.ID` |
| Timestamps | DATETIME | UTC; the model casts |
| Boolean flags | TINYINT(1) | not BOOLEAN |
| JSON blobs | LONGTEXT | with `'<col>' => 'array'` cast in model |

## Anti-patterns

- ❌ Editing an existing migration file in place.
- ❌ Using `$wpdb->prefix . 'pm_'` concatenation in a query string instead of `prepare`/interpolation of the safely-built table name.
- ❌ `DROP COLUMN` without explicit user approval.
- ❌ Forgetting to update `Create_Table.php` (fresh installs will lack the column).
- ❌ Adding a column without updating the model's `$fillable` (writes silently drop the value).

## Verification

```bash
# After deactivate/reactivate:
wp db query "SHOW COLUMNS FROM wp_pm_tasks;"  # via wp-cli

# Re-run migration to confirm idempotent
# (deactivate → reactivate again; should not error)
```
