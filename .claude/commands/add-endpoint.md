---
description: "Add a new REST endpoint with permission, validator, sanitizer, transformer."
---

# /add-endpoint — Scaffold a new REST endpoint

## Goal
Create a new endpoint end-to-end, matching the codebase's exact conventions: route file → permission class → validator → sanitizer → controller method → model → transformer.

## Inputs
- $ARGUMENTS: free-form spec, e.g. `POST projects/{project_id}/tasks/bulk-update — bulk update task priorities`

## Procedure

1. **Parse the spec.**
   - Method (GET/POST/PUT/DELETE), path, purpose.
   - Identify the feature: maps to `src/<Feature>/` and `routes/<feature>.php`.

2. **Choose or create the permission class.**
   - Look in `core/Permissions/` first — 29 classes already exist. Reuse if applicable (`Authentic`, `Access_Project`, `Create_Task`, `Edit_Task`, `Complete_Task`, `Delete_Task`, `Administrator`, …).
   - If new: create `core/Permissions/<Name>.php` with `public function can()` returning bool.

3. **Define the route** in `routes/<feature>.php`:
   ```php
   $wedevs_pm_router->post( '<path>',
       'WeDevs/PM/<Feature>/Controllers/<Feature>_Controller@<method>' )
       ->permission([ 'WeDevs\PM\Core\Permissions\<Permission>' ])
       ->validator( 'WeDevs\PM\<Feature>\Validators\<Name>' )       // POST/PUT only
       ->sanitizer( 'WeDevs\PM\<Feature>\Sanitizers\<Name>' );      // POST/PUT only
   ```
   Routes auto-load — no need to edit `bootstrap/`.

4. **Validator** at `src/<Feature>/Validators/<Name>.php`.
   Pattern: existing validators in the same feature (e.g., `src/Task/Validators/Create_Task.php`).

5. **Sanitizer** at `src/<Feature>/Sanitizers/<Name>.php`.
   Pattern: existing sanitizers in the same feature.

6. **Controller method.**
   - Read existing controller in `src/<Feature>/Controllers/`.
   - Add method matching the existing style (DI, traits like `Transformer_Manager`, `Request_Filter`, `Last_activity`).
   - Sanitize → query/mutate via Eloquent → fire `do_action(...)` → return Fractal output.

7. **Transformer** (if response shape differs from existing).
   - Add to `src/<Feature>/Transformers/<Name>_Transformer.php` extending `League\Fractal\TransformerAbstract`.
   - Cast types (`(int)`, `(bool)`, `->toISOString()` for Carbon).

8. **Frontend integration.**
   - Add a thunk in `views/assets/src/store/<feature>Slice.js` using `createAsyncThunk` + `useApi`.
   - Call `useApi.post|get|put|delete('<path>', body)` — never raw fetch.
   - Include `?with=...` if Fractal includes are needed.

9. **Test.**
   - Codeception unit/functional in `tests/`.
   - Manual: `pnpm dev`, exercise via UI.

## Verification checklist
- [ ] Route has permission, validator (if POST/PUT), sanitizer (if POST/PUT)
- [ ] Controller sanitizes all params
- [ ] Response goes through Fractal transformer
- [ ] Action hook fired on mutation (`pm_after_new_<x>`, `pm_after_update_<x>`)
- [ ] Frontend uses `useApi`, sends `is_admin`, uses `?with=` not `?include=`
- [ ] Codeception test added
