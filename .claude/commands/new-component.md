---
description: "Scaffold a new React component matching plugin conventions."
---

# /new-component — Create a new React component

## Goal
Add a new `.jsx` component under `views/assets/src/components/<area>/` matching existing patterns: shadcn/ui first, `pm-` CSS prefix, Redux for data, hooks for side effects.

## Inputs
- $ARGUMENTS: name + area, e.g. `TaskPriorityPicker in tasks`

## Procedure

1. **Pick location.**
   `views/assets/src/components/<area>/<Name>.jsx`. Areas: `projects`, `tasks`, `my-tasks`, `layout`, `common`, `admin-settings`, `ui` (shadcn primitives — only add new primitives here).

2. **Check for shadcn/ui primitives first.**
   List `views/assets/src/components/ui/`. If a primitive covers the need (Button, Dialog, Sheet, Popover, DropdownMenu, Select, Switch, Checkbox, Calendar, Command, Badge, Card, Skeleton, Avatar, Table, Tabs, Accordion, Progress, Tooltip, Separator, ScrollArea, AlertDialog, ColorPicker), compose with it.

3. **Write the component.**
   ```jsx
   import React from 'react'
   import { useAppDispatch, useAppSelector } from '@store/index' // if Redux needed
   import { Button } from '@components/ui/button'
   import { cn } from '@/lib/pm-utils' // or '@lib/pm-utils' depending on aliases

   export function TaskPriorityPicker({ taskId, value, onChange }) {
     // local state via useState; cross-component state via Redux slice
     return (
       <div className="pm-priority-picker flex items-center gap-2">
         <Button variant="ghost" size="sm">…</Button>
       </div>
     )
   }
   ```

4. **Rules.**
   - Functional + hooks only (no class components).
   - All custom classes prefixed `pm-`.
   - No banned WP names (`.button .active .modal .form .card .table .spinner .notice .header`).
   - z-index ≤ 700.
   - Portaled Radix elements must target `#pm-portal-root` (override `container` prop where supported).
   - API calls via `@hooks/useApi`. No raw `fetch`.
   - Toasts via `sonner` (imported from `sonner` directly; do NOT introduce a different toast lib).
   - Icons from `lucide-react`.
   - Dates via `date-fns`.

5. **Redux integration.**
   - Read: `useAppSelector(s => s.<slice>.<field>)`.
   - Write: `useAppDispatch()` → dispatch a thunk from the relevant slice.
   - Don't dispatch from inside an event handler that runs during render.

6. **Pro gating (if needed).**
   ```jsx
   {PM_Vars.is_pro
     ? <ProOnlyContent />
     : <ProGate featureName="X" />}
   ```
   Pro overrides via `window.PM.registerFilter('...', el)` — expose a filter point if appropriate:
   ```jsx
   const Override = useFilter('task.priority-picker', null)
   if (Override) return Override
   ```

7. **i18n.**
   ```jsx
   import { __ } from '@wordpress/i18n'
   <span>{__('Priority', 'wedevs-project-manager')}</span>
   ```

8. **Tests.**
   - Playwright spec at `tests/e2e-playwright/` covering the interaction.

## Verification
- [ ] `pnpm lint` clean
- [ ] `pnpm build` succeeds
- [ ] Component renders under `#wedevs-project-manager` in WP admin without leaking styles
- [ ] No new CSS class violates the `pm-` prefix or banned-name rules
- [ ] Works in Free without Pro installed
- [ ] If a filter/slot is exposed, Pro can replace via `registerFilter`/`registerSlot`
