---
description: "Add a new permission class for the custom REST router."
---

# /add-permission — Add a permission class

## Goal
Add a class to `core/Permissions/` that the router can chain via `->permission([...])`. Each class implements `can(): bool`.

## Inputs
- $ARGUMENTS: name + condition, e.g. `Delete_Milestone — only project managers can delete milestones`

## Procedure

1. **Audit existing classes** to avoid duplicates:
   ```
   ls core/Permissions/
   ```
   29 classes already exist (`Authentic`, `Access_Project`, `Administrator`, `Create_Task`, `Edit_Task`, `Complete_Task`, `Delete_Task`, `Project_Create_Capability`, `Project_Manage_Capability`, …). Reuse when possible.

2. **Pick the name.** Convention: `<Action>_<Resource>` or `<Resource>_<Capability>` — match nearby files.

3. **Write the class.**
   ```php
   <?php
   namespace WeDevs\PM\Core\Permissions;

   class Delete_Milestone {
       public function can() {
           $project_id = isset( $_REQUEST['project_id'] ) ? intval( $_REQUEST['project_id'] ) : 0;
           $user_id    = get_current_user_id();

           if ( ! $user_id ) {
               return false;
           }

           // Reuse capability lookup from existing permission classes
           // — search for a similar class and copy the pattern.

           return /* boolean */;
       }
   }
   ```

4. **Reuse helpers.** Look at how related classes resolve capabilities (`pm_user_can_*` helpers, Role/Capability tables `wp_pm_roles`, `wp_pm_capabilities`, `wp_pm_role_users`, `wp_pm_role_projects`).

5. **Attach to routes.**
   ```php
   $wedevs_pm_router->post( 'projects/{project_id}/milestones/{milestone_id}/delete',
       'WeDevs/PM/Milestone/Controllers/Milestone_Controller@destroy' )
       ->permission([ 'WeDevs\PM\Core\Permissions\Delete_Milestone' ]);
   ```

6. **Test.**
   - Codeception functional: assert 403 for non-permitted users, 200 for permitted.

## Verification
- [ ] No duplication of an existing class
- [ ] `can()` returns strictly bool, no truthy strings
- [ ] Reads `project_id` defensively (intval / isset)
- [ ] Attached to every route that should be gated
- [ ] Functional test covers both pass + fail paths
