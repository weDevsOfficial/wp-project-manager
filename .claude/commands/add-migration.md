---
description: "Add a database migration (append-only schema change)."
---

# /add-migration — Add a DB migration

## Goal
Add a new file under `db/migrations/` to evolve the schema. NEVER edit existing migration files or `db/Create_Table.php` rows for shipped tables.

## Inputs
- $ARGUMENTS: description, e.g. `add priority column to wp_pm_tasks`

## Procedure

1. **Read existing migrations** to match naming + pattern:
   ```
   ls db/migrations/
   ```
   Migrations are timestamp- or version-prefixed PHP files run by `core/Database/Migrater.php`.

2. **Pick a name** matching the convention you observe (e.g., `20260512_add_priority_to_tasks.php` or `M_0NN_add_priority_to_tasks.php` — confirm with existing files).

3. **Write the migration.** Pattern (verify against the latest existing migration):
   ```php
   <?php
   global $wpdb;

   $table = $wpdb->prefix . 'pm_tasks';

   $col_exists = $wpdb->get_var( $wpdb->prepare(
       "SHOW COLUMNS FROM {$table} LIKE %s", 'priority'
   ) );

   if ( ! $col_exists ) {
       $wpdb->query( "ALTER TABLE {$table}
           ADD COLUMN `priority` VARCHAR(20) NOT NULL DEFAULT 'normal' AFTER `status`" );
   }
   ```
   - Always check existence first — migrations may re-run.
   - Use `$wpdb->prefix . 'pm_<table>'`.
   - Schema additions are forward-only; never `DROP COLUMN` without explicit user approval.

4. **Update the Eloquent model** in `src/<Feature>/Models/` to expose the new field (`$fillable`, `$casts`).

5. **Update the transformer** in `src/<Feature>/Transformers/` to surface the field.

6. **Update `db/Create_Table.php`** to include the new column for FRESH installs.

7. **Run.**
   - Deactivate + reactivate the plugin (triggers `wedevs_pm_migrate_db` via `bootstrap/loaders.php`).
   - Or call `(new \WeDevs\PM\Core\Database\Migrater())->build_schema()` in a test.

## Verification
- [ ] New column visible in DB after activation
- [ ] Existing rows have the default value
- [ ] Re-running migration is idempotent
- [ ] `db/Create_Table.php` includes the column for fresh installs
- [ ] Model `$fillable`/`$casts` updated
- [ ] Transformer exposes the field

## Anti-patterns
- ❌ Editing a shipped migration file
- ❌ Renaming a column (write a new migration that adds new + copies + drops old in a separate step)
- ❌ Touching `wp_pm_*` tables outside a migration
