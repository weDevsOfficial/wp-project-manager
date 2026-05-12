# Free ↔ Pro Bridge

The Free plugin (this repo) is the host. The Pro plugin (`../pm-pro/`) attaches at runtime through `window.PM`. Every public surface here is a contract.

## The `window.PM` object

Defined in `views/assets/src/index.jsx`. Anything added is a public API; anything removed is a breaking change for Pro.

```js
window.PM = {
  // Extension primitives
  registerSlot, registerFilter, applyFilters, doAction, addAction,
  Slot, useFilter, useSlotFills,
  injectReducer, registerRoute, useRegisteredRoutes,
  registerNavItem, useRegisteredNavItems,
  store, setDarkMode,

  // Free thunks/actions Pro may dispatch
  thunks:  { fetchTask, fetchTaskLists, fetchProjectAssignees },
  actions: { resetProjectState, openTaskSheet, closeTaskSheet, markTaskModified },

  // Free hooks Pro may call (same Redux store context)
  hooks:   { useProjectAssignees },

  // Free components Pro composes with
  components: {
    UserAvatar, TaskLabelBadges, ErrorBoundary,
    AdminRoute, ProjectRoute, LicenseRoute, ManagerRoute,
    BackButton, FileUploadArea, ProBadge, ProUpgradeModal, LicenseGuard,
    NewTaskSheet, TaskDetailSheet,
  },

  // Re-exported libs — Pro externalizes via webpack to use THESE instances
  libs:    { React, ReactDOM, ReactJsxRuntime, ReactRedux, ReactRouterDom, ReduxToolkit, Sonner },

  // Re-exported shadcn primitives + a few common helpers
  ui:      { /* Avatar, Badge, Button, Card, Checkbox, Dialog, … */ },

  // Re-exported Radix primitives — same context instances
  radix:   { Dialog, Popover, DropdownMenu, Select, Checkbox, … },

  // Shared utilities
  utils:   { urlStrippers, sanitize, pmUtils },
}
```

## Webpack externals (Pro side)

Pro's `webpack.config.js` MUST externalize:
- `react`, `react-dom`, `react/jsx-runtime`
- `react-redux`, `react-router-dom`, `@reduxjs/toolkit`
- `sonner`
- All `@radix-ui/react-*` it uses
- A function external that intercepts `@components/common/*`, `@components/ui/*`, `@lib/*` resolved paths and maps to `window.PM`

**Why:** if Pro bundles its own React/Radix, contexts (DismissableLayer, FocusScope, Redux Provider) duplicate and break interaction — clicks get eaten, store reads fail.

## Slots (composition points)

Free declares a slot:
```jsx
<Slot name="task.detail.subtasks" />
```

Pro fills it at runtime:
```js
window.PM.registerSlot('task.detail.subtasks', SubtasksComponent)
// WP action fires:
// do_action('pm_slot_registered')
```

## Filters (replacement points)

Free declares a filter:
```jsx
const Override = useFilter('route.kanban.element', null)
if (Override) return Override
```

Pro replaces:
```js
window.PM.registerFilter('route.kanban.element', <KanbanBoard />)
```

## Dynamic Redux

Pro injects reducers:
```js
window.PM.injectReducer('kanban', kanbanSlice.reducer)
```
Naming: top-level slice key matches the feature.

## Dynamic routes

```js
window.PM.registerRoute('projects/:projectId/kanban', <KanbanBoard />)
```

## Dynamic nav

```js
window.PM.registerNavItem({ path, label, icon, order, ... })
```

## When Free adds/changes a contract

1. Bump expectations in `views/assets/src/index.jsx` `window.PM` export.
2. Decide: is this a **new** field (additive, safe) or a **change** (breaking)?
3. Document the contract in this file.
4. Coordinate with Pro maintainer if breaking.

## When Pro is not installed

Free must still work. Guard with:
```jsx
{typeof PM_Pro_Vars !== 'undefined' ? <ProThing /> : <FreeFallback />}
```
The `_proReady` flag on `window.PM` tells Free when Pro has finished registering slots/filters/routes — used to avoid a flash of free placeholder when Pro is installed but slow to boot.

## Anti-patterns

- ❌ Free importing from `../pm-pro/`.
- ❌ Pro importing from `wp-project-manager/views/assets/src/` (must go through window.PM).
- ❌ Bundling React/Redux/Radix in Pro (must be externals).
- ❌ Touching `window.PM` shape without coordinating with Pro repo.
