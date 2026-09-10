# WP Project Manager — QA Report

**Build under test:** `ui-modernization` (new UI) vs `develop` (old UI), Free `wedevs-project-manager` + Pro `pm-pro`
**Date:** 2026-08-24
**Tester:** arifulhoque7 (automated via Playwright)
**Pro license:** active (Business, key `d9a49674…`)

---

## 1. Test environment

| Item | New UI | Old UI |
|---|---|---|
| Site | `https://we-pm.test` | `https://we-pm-old.test` |
| Branch (free / pro) | `ui-modernization` / `ui-modernization` | `develop` / `develop` |
| Data | full demo seed | **identical clone** of the new-UI DB |
| Active plugins | `wedevs-project-manager`, `pm-pro`, `user-switching` only | same |
| `WP_DEBUG` | off | off |
| WordPress / PHP | 7.x / 8.0.30 | same |

Both sites share identical data (DB cloned table-for-table), so old-vs-new is apples-to-apples.

**Role test users (ready, not yet exercised):** `1` admin · `12/13` project-scoped managers (Manager_Anywhere, no global cap) · `25` plain member (project 21, non-manager) · `26` non-member subscriber.

**Temporary QA aid:** `mu-plugins/zz-test-autologin.php` (secret-gated passwordless login, local only) on both sites — **remove after QA**.

---

## 2. Functional full-cycle test — PARALLEL on both UIs

Every step done through the real UI; each result verified in the database on both sites (identical ids prove parity).

| Step | New UI | Old UI | DB verification |
|---|---|---|---|
| Create project ("QA Full Cycle") | ✅ | ✅ | project **id 21**, status 0, both |
| Task list | auto **Inbox** | auto **Inbox** | board **id 231**, both |
| Add task ("Cycle Task 1") | ✅ | ✅ | task **id 1471**, both |
| Complete task | ✅ status→1 | ✅ status→1 | `completed_at` set, both |
| Assign existing member | ✅ | (parity via shared code) | `wp_pm_assignees` row |
| Add project members (Dana 12, Ed 13) | ✅ | (parity) | `wp_pm_role_user` rows |
| Assign added member to task | ✅ (after reload — see §4 Bug 1) | (parity) | task 1471 → admin + Dana |

**Verdict:** core create→list→task→complete→assign cycle **works end-to-end and identically** on both UIs.

---

## 3. New UI vs Old UI — behavior identical, layout changed

- New UI adds a **Dashboard** nav item (old UI starts at Projects). *(excluded from comparison per request)*
- Task detail: new UI = **centered modal**; old UI = **right-side slide-over** (list stays visible beside it).
- Projects filter order (All-first vs Active-first); card meta (`25/50 tasks` vs `25 done / 50 total`).
- Both expose the full Pro sub-nav (Kanban, Gantt, Invoices, Sprints, G Workspace…) — license active on both.

---

## 4. Real-time / reactive behavior

### Works live (no refresh needed) ✅

| Action | Reflects live | Evidence |
|---|---|---|
| Complete task (sheet toggle) | list header `1/1`, `100%`, task → "Completed" group — while modal open | DB status=1 |
| Assign existing member | chip + **Track Time** section appear instantly | assignee row |
| Add project member (Overview) | member count + avatars update live | role_user rows |
| Project Overview stats | 1 task / 1 completed / 100% reflect the cycle | — |
| List comments add/edit/delete | in-place reducers keep them live | taskListsSlice 427–436 |

### Needs a manual refresh (BUGS) ❌ — see §5

---

## 5. Bug list — "why we need refresh"

> Class the user flagged: an action that does NOT show until a full page reload.
> Verified by reading the code (exact file:line cited). Every finding present in **both UIs** (pre-existing shared code — not introduced by ui-modernization).

### Fix status (updated) — ALL user-facing findings FIXED
**13 fixed** on develop (`fix/realtime-cache-invalidation`, PRs wp-project-manager#666 / pm-pro#473), merged into `ui-modernization`, built on both UIs:
FREE-1, FREE-2, FREE-3, PRO-1, **PRO-2**, PRO-3, PRO-4, PRO-6, PRO-7, PRO-8/9, PRO-10, **PRO-11** → **FIXED**.
Live-verified: FREE-1/2 (both UIs), PRO-1 (old UI), PRO-6 (new UI). Others code+build verified.
**Only dead-code cleanup remains** (no user impact): FREE-4/5/6, PRO-5, PRO-12.
See `QA-REALTIME-REFRESH-FIX-PLAN.md` for per-fix commits + approach.

### Severity index (16 findings: 3 High · 8 Med · 5 Low)

| # | Severity | Bug (needs refresh) | Area |
|---|---|---|---|
| FREE-1 | **High** | Task-list/detail assignee pickers miss added/removed members | free |
| FREE-2 | **High** | Kanban assignee filter + card options miss added members | free |
| PRO-1 | **High** | Module activate/deactivate — nav/routes/features not applied | pro |
| FREE-3 | Med | Project category filter stale after category CRUD | free |
| PRO-2 | Med | Label rename/recolor/delete ghosts on task-row badges | pro |
| PRO-3 | Med | Settings Labels-tab diverges from label slice | pro |
| PRO-6 | Med (High-ish) | Editing a sprint doesn't update the card | pro |
| PRO-7 | Med | Remove-from-sprint leaves header stats stale | pro |
| PRO-8 | Med | Task delete via sheet → ghost Calendar event | pro |
| PRO-9 | Med | Task delete via sheet → ghost Gantt bar | pro |
| PRO-10 | Med | Timer "running" state bleeds across tasks | pro |
| PRO-4 | Low | Emailing an invoice doesn't refresh the row | pro |
| PRO-11 | Low-Med | Promote subtask → task not inserted into target board | pro |
| FREE-4/5/6 | Low | Dead reducers (clearLists/clearListComments/clearDragState) — no impact | free |
| PRO-5 | Low | Dead reducers (invoice/label/report/calendar) — no impact | pro |
| PRO-12 | Low | Latent dead code (ganttSlice, sprint thunks, customFields) | pro |

**Two shared root causes** — fixing these clears several rows:
- **Member-cache never invalidated** → FREE-1 + FREE-2 (dispatch `invalidateProjectCache`/`invalidateProjectAssignees` on member change).
- **Free `deleteTask` never sets `taskModifiedInSheet`** → PRO-8 + PRO-9 (set the flag on delete, or add `tasks/deleteTask/fulfilled` to calendar+gantt slices).

### 5A · FREE plugin

#### FREE-1 · Task-list + task-detail assignee pickers don't see added/removed project members — HIGH
- **Files:** `hooks/useCurrentProject.js:5,17,24,38` (module `Map` cache; `invalidateProjectCache` at :38 **called nowhere**) → written stale by `components/projects/ProjectOverview.jsx:168-188` (add member), `:190-223` (change role), `:225-248` (remove member) — each `api.post('.../update')` then `setProject` on its **own** local state only → consumed by `components/tasks/TaskListSection.jsx:65,86` and `components/tasks/TaskDetailSheet/index.jsx:97,302`.
- **Why refresh:** `useCurrentProject(id)` fetches `projects/{id}?with=assignees,assignees.roles` once and caches in a module Map; nothing invalidates it. ProjectOverview owns a separate `project` state and never calls `invalidateProjectCache`, so pickers keep the pre-change member list all session.
- **Repro:** open project → Task Lists (caches). Overview → add/remove a teammate. Back to Task Lists → task assignee picker / inline add-task assignee search → new member absent (removed member still listed). Reload → correct. **(This is the one reproduced live in §2/§4.)**
- **Severity:** High — can't assign a just-added teammate (or stop offering a removed one) without reload.
- **Present in:** both UIs.
- **Fix:** call `invalidateProjectCache(projectId)` after member add/remove/role-change in ProjectOverview (and any updateProject that changes assignees).

#### FREE-2 · Kanban assignee filter + card assignee options don't see added members — HIGH
- **Files:** `store/projectsSlice.js:271-278` (`invalidateProjectAssignees` defined), `:394` (exported), `:183-184` (thunk returns cached copy); `hooks/useProjectAssignees.js:14-17` (`if (assignees !== undefined) return`); only consumer `components/KanbanBoard/index.jsx:51`. `invalidateProjectAssignees` dispatched **nowhere**.
- **Why refresh:** `projects.projectAssignees[id]` filled once; both thunk + hook guards block refetch; the clearing reducer is never dispatched.
- **Repro:** open Kanban (loads assignees). Add a member in Overview. Back to Kanban → Filter panel user list / card assignee menu → new member missing until reload.
- **Severity:** High mechanism; practical exposure Med (Kanban is the only consumer).
- **Present in:** both UIs.
- **Fix:** `dispatch(invalidateProjectAssignees(projectId))` after member add/remove (pair with FREE-1).

#### FREE-3 · Project category filter stale after create/edit/delete category — MEDIUM
- **Files:** `components/projects/CategoriesPage.jsx:60-74` (own state + `api.get('categories')`), mutations `:105/:112/:138/:156` (none touch Redux); `store/projectsSlice.js:120` (`if (state.categoriesLoaded) return`) + `:364-366` (sets flag, no invalidation). Redux consumers: `components/projects/ProjectsPage/index.jsx:144`, `components/dashboard/parts/DashboardHeader.jsx:38`.
- **Why refresh:** category set lives in two caches; Categories page mutates only its local list, and the `fetchCategories` thunk feeding the Projects filter short-circuits permanently after first load.
- **Repro:** Projects page (loads filter) → Categories → add "Marketing" → back to Projects → filter lacks "Marketing" (and still lists deleted ones). Reload → correct.
- **Severity:** Med — can't filter by a new category; deleted categories stay selectable, until reload.
- **Present in:** both UIs.
- **Fix:** add `invalidateCategories` (reset `categoriesLoaded`) + dispatch after category mutations, or write through to `projects.categories`.

#### FREE-4/5/6 · Dead reducers — LOW (no visible impact, dead code)
| Reducer | File | Assessment |
|---|---|---|
| `clearLists` | `taskListsSlice.js:201-207` | Redundant — project switch already resets via `resetProjectState` (:440) and `fetchTaskLists.pending` (:323). No stale view. |
| `clearListComments` | `taskListsSlice.js:208-210` | Redundant — `listComments` overwritten on every `fetchSingleList.fulfilled` (:345-348). No stale view. |
| `clearDragState` | `kanbanSlice.js:194` | Orphaned — `dragState`/`setDragState`/`resetKanban` unused everywhere; DnD handled locally in `KanbanDndBoard`. Remove as dead code. |

**Checked clean (no bug):** tasksSlice create/update/status/comment sync back into lists/milestones/boards via `syncTaskInLists`/`syncTaskInMilestones`/`syncTaskInBoards`; Kanban reloads all boards after add/import/create/delete/move + on sheet close; My Tasks `NewTaskSheet` refetches via `onCreated`; MilestonesPage refetches after import + sheet close (**MilestoneField dropdown is NOT stale — the field remounts and refetches per task-open**); Settings task types share the `settings.taskTypes` Redux slice with the Type picker; googleWorkspace's unused `attachmentsByTask` cache has no consumer (no active dual-cache staleness).

### 5B · PRO plugin

#### PRO-1 · Module activate/deactivate not reflected (nav, routes, feature UI) until reload — HIGH
- **Files:** `store/pro/modulesSlice.js:69-75` (toggleModule.fulfilled mutates only `activeModules`) · `components/ProModulesPage.jsx:61-70` · `index.jsx:40-46` (`isModuleActive` reads `PM_Pro_Vars.active_modules`) · `index.jsx:158-224` (all `registerRoute`/`registerNavItem`/`registerSlot`/`registerFilter` gated once at init) · module-load-time gates in `TaskInlineProperties.jsx:16-26`, `project-settings/ProjectSettingsPage.jsx:12-16`, `ProReportsPage/index.jsx:15-18,26`, `TimeTrackerWidget/index.jsx:14-15`.
- **Why refresh:** toggle updates Redux `activeModules` (read only by the Modules switch). Every real feature surface — Gantt/Invoice/Sprint routes + nav, Sub_Tasks/inline-properties/estimation task slots, Woo + Custom_Fields settings tabs, Time_Tracker report card — is registered once at pro init from PHP-localized `PM_Pro_Vars.active_modules`, evaluated once at import. Redux change never re-runs registration.
- **Repro:** Modules page → toggle Gantt ON → switch flips, but no "Gantt" nav link, `/projects/:id/gantt` 404s. Reload → appears. Reverse for disable.
- **Severity:** High — the module toggle's whole purpose is invisible without reload; affects every pro module.
- **Present in:** both UIs (byte-identical gating).
- **Fix:** drive `isModuleActive`/registration off live Redux `activeModules` (re-render nav/routes on change), or refresh `PM_Pro_Vars.active_modules` + re-run registration after toggle; interim: force reload after toggle.
- **Caveat (same root):** activate pushes `res.data ?? res`; if it lacks `path`, `ProModulesPage.isActive` (`m.path === path`, :59) reads OFF → even the switch can look unchanged until reload.

#### PRO-2 · Label rename/recolor/delete not reflected on task-row / my-tasks badges until tasks refetch — MEDIUM
- **Files:** `store/pro/labelsSlice.js:82-91` (CRUD.fulfilled mutate `state.labels` only) · `components/ProTaskLabelBadges.jsx:12-13` (`task?.labels?.data`) · `components/LabelManager.jsx:181-191`.
- **Why refresh:** labels cached twice — `state.labels` and the `labels.data` embedded on each task. Edits/deletes touch only `state.labels`; row badges read `task.labels.data`, which nothing invalidates → renamed label keeps old text/color, deleted label keeps showing, until tasks refetch.
- **Repro:** task has label "Bug" → edit to "Defect"/recolor → task-list rows still "Bug" old color; delete a label → rows still show it. Reload → correct.
- **Severity:** Med — persistent wrong/ghost data on the main task views.
- **Present in:** both UIs.
- **Fix:** on label update/delete, patch matching labels inside the tasks slice (or refetch task list); at minimum splice deleted id out of every loaded `task.labels.data`.

#### PRO-3 · Project Settings → Labels tab uses isolated local state, diverges from label slice — MEDIUM-LOW
- **Files:** `components/project-settings/LabelsTab.jsx:22` (`useState([])`), `:30-39` (direct API), `:89-121` (raw `proApi` CRUD, local `setLabels`) — never touches `labelsSlice`.
- **Why refresh:** LabelsTab keeps its own list + hits REST directly; task-detail `LabelManager`/`LabelPicker` read `state.labels`. No cross-notify → editing labels in Settings leaves `state.labels` stale for already-mounted pickers (self-corrects only on remount).
- **Repro:** open a task's label picker (loads slice) → Settings → Labels → rename → back to still-open picker → old name.
- **Severity:** Med-low — resolves on remount; compounds PRO-2.
- **Present in:** both UIs.
- **Fix:** route LabelsTab CRUD through labelsSlice thunks (or dispatch `fetchProjectLabels` after save).

#### PRO-4 · Emailing an invoice doesn't update the list — LOW
- **Files:** `store/pro/invoiceSlice.js:86-96` (`sendInvoiceEmail`, no fulfilled reducer) · `components/InvoicePage.jsx:99-104` (`handleEmail`, no refetch).
- **Why refresh:** if send flips a server-side field (e.g. "sent" status), the row doesn't reflect it until reload. (create/update/pay/delete all refetch — fine.)
- **Repro:** Invoices → Send Email → toast, but row status unchanged until reload.
- **Severity:** Low — only if emailing mutates a displayed field; no data loss.
- **Present in:** both UIs.
- **Fix:** `dispatch(fetchInvoices(...))` in `handleEmail`, or add a fulfilled reducer patching status.

#### PRO-5 · Dead reducers — LOW (no impact, dead code)
`invoiceSlice.js:102-103` (`setCurrentInvoice`,`resetInvoices`) · `labelsSlice.js:65-66` (`setLabels`,`resetLabels`) · `reportsSlice.js:349` (`resetReports`) · `calendarSlice.js:57` (`resetCalendar`) — dispatched nowhere; clearing already handled by each slice's `*.pending` + global `resetProjectState`. (`clearReportData`/`clearSummary`/`resetFilters`/`resetProgress`/`clearTemplateError` ARE live — not dead.) Fix: delete unused.

**Checked clean (set 2):** templatesSlice (CRUD update list+byId); invoice create/update/pay/delete (refetch via `InvoiceFormSheet`/`PaymentDialog`/`refreshDetail`); reportsSlice (query-driven, task edits synced via extraReducers, no fetch-once guard); progressSlice (refetch on mount + sheet edits); calendarSlice (task mutations synced, request-id guard); google-workspace capability values are per-mount `useState` + shared `status` refetched on mount + full-redirect connect; WooProjectPage settings mirror into `PM_Vars.settings`.

#### PRO-6 · Editing a sprint (title/dates/description/projects) doesn't update the card until reload — HIGH
- **Files:** `store/pro/sprintSlice.js:38-48` (`updateSprint` thunk has **no** `.fulfilled` case in the reducer block 130-228); `components/SprintPage/parts/SprintItem.jsx:119-123` (`handleUpdate` dispatches, closes dialog, toasts — never calls `onRefresh`/`fetchData`).
- **Why refresh:** thunk resolves with the updated sprint but nothing writes it into `state.sprint.sprints`, and the component doesn't refetch. The card keeps rendering the pre-edit object.
- **Repro:** Sprints → sprint menu → Edit → change title/dates → Update. Toast "updated", dialog closes, card still shows OLD values until tab-switch/reload.
- **Severity:** High — core, common action that looks broken.
- **Present in:** both UIs.
- **Fix:** add `updateSprint.fulfilled` to replace the sprint in `state.sprints`, or call `onRefresh()` in `handleUpdate`.

#### PRO-7 · "Remove from sprint" leaves the sprint header stats (progress %, est/completed/due) stale — MEDIUM
- **Files:** `components/SprintPage/parts/SprintItem.jsx:155-169` (non-permanent branch 165-168 has **no** `onRefresh`, unlike every sibling handler); `store/pro/sprintSlice.js:216-227` (`removeTaskFromSprint.fulfilled` filters task arrays only, never touches `sprint.meta`).
- **Why refresh:** row disappears (reducer), but the top-of-card progress bar (:208-209,262) and Est/Completed/Due chips (:241-263) read server-computed `sprint.meta`, never recomputed or refetched.
- **Repro:** expand sprint → task menu → Remove from sprint → task vanishes but progress % / time chips unchanged until reload.
- **Severity:** Med — visibly inconsistent numbers.
- **Present in:** both UIs.
- **Fix:** `.then(() => onRefresh?.())` on the non-permanent branch.

#### PRO-8 · Deleting a task from the detail sheet leaves the event on the Calendar — MEDIUM
- **Files:** `store/pro/calendarSlice.js:60-110` (has updateTask/fetchTask/changeTaskStatus fulfilled but **no** `tasks/deleteTask/fulfilled`); `components/ProCalendarPage/index.jsx:146-154` (refetch-on-close gated on `taskModified`); Free delete path `TaskDetailSheet/index.jsx:448-460` calls `closeTaskSheet()`+`deleteTask` but **never sets `taskModifiedInSheet`**.
- **Why refresh:** no reducer removes the deleted task from `state.calendar.events`, and the `taskModified` refetch fallback doesn't fire for a pure delete.
- **Repro:** Calendar → click task event → Delete in sheet → sheet closes, event stays on grid until month-nav/reload.
- **Severity:** Med — ghost event, still clickable.
- **Present in:** both UIs.
- **Fix:** add `tasks/deleteTask/fulfilled` filtering `state.events` by deleted id. *(shares root cause with PRO-9 — see note.)*

#### PRO-9 · Deleting a task from the detail sheet leaves the bar on the Gantt chart — MEDIUM
- **Files:** `components/GanttChart/index.jsx:164-169` (sheet-close reload gated on `taskModified`); gantt tasks in local `features` state (:58, `loadData` 80-157), no Redux delete handler. Same root cause as PRO-8.
- **Why refresh:** Gantt's own context-menu delete calls `loadData()` (works), but delete via the shared task sheet neither mutates `features` nor triggers the `taskModified` reload.
- **Repro:** Gantt → click bar → Delete in sheet → bar stays on timeline until reload.
- **Severity:** Med.
- **Present in:** both UIs.
- **Fix:** reload gantt on any sheet-close-after-open, or have sheet delete set `taskModified`.

#### PRO-10 · Phantom "running" timer bleeds across tasks (`clearRunningTimer` dead) — MEDIUM
- **Files:** `store/pro/timeTrackerSlice.js:112` (`clearRunningTimer` dispatched nowhere); only `stopTimer.fulfilled:132-137` + `resetProjectState:116` null `runningTimer`; `components/TimeTrackerWidget/parts/Timer.jsx:41` derives `isRunning` from **global** `runningTimer.running` with **no `task_id` check**; `TimeTrackerWidget/index.jsx:35-44` sets it on mount, never clears on task switch.
- **Why refresh:** `runningTimer` is one global object. Start timer on task A → open task B (same project, no reload) → B sees `running===true` and ticks as if B is tracking. Nothing resets it (clearRunningTimer dead; resetProjectState only fires on project change).
- **Repro:** open task A, start timer, without stopping open task B → B shows a running (red) timer counting up though nothing is tracked for B.
- **Severity:** Med — misleading; can log time against the wrong task if stopped from B.
- **Present in:** both UIs.
- **Fix:** gate `isRunning` on `String(runningTimer?.task_id) === String(taskId)`; dispatch `clearRunningTimer` on task switch.

#### PRO-11 · "Move to Task" (promote subtask) doesn't insert the new task into the target board — LOW-MED
- **Files:** `store/pro/subtasksSlice.js:145-147` (`promoteSubtaskToTask.fulfilled` filters the subtask out; discards returned `newTask`/`listId`); `components/SubtaskList/parts/MoveToTaskModal.jsx:47-62` (refetches parent + `markTaskModified`, never inserts the created task).
- **Why refresh:** subtask leaves + parent count updates, but the new standalone task in `listId` isn't added to any board slice; appears only where a board refetches on sheet close.
- **Repro:** task sheet → subtask → Move to Task → pick a different list → Move → open that list → promoted task may be missing until reload.
- **Severity:** Low-Med (mitigated on `taskModified`-aware boards).
- **Present in:** both UIs.
- **Fix:** dispatch a task-list insert with `newTask`/`listId`, or refetch the target list.

#### PRO-12 · Latent dead code (no visible impact today) — LOW
- **`ganttSlice` entirely dead** (`store/pro/ganttSlice.js:10-52`) — `createLink`/`deleteLink`/`links`/`setLinks` used nowhere; Gantt keeps links in local state + `loadData()`. Trap if links ever wired to these thunks.
- **Dead sprint thunks/reducers** (`sprintSlice.js`) — `addTaskToSprint` (86-96) never dispatched; `fetchSprintTasks` (74-84) reducer never dispatched (component uses raw `proApi.get`); `moveTaskBetweenSprints` (110-120) dispatched but no reducer (compensated by `loadTasks()+onRefresh()`).
- **customFields gaps** (`customFieldsSlice.js:62-72,88-97`) — `setCustomFieldValue` no fulfilled reducer; create/update/delete reducers unused (settings tab uses own local state); no `resetProjectState` case. Masked because `CustomFieldsSection` keeps optimistic values + refetches per mount.

> **Cross-cutting root cause (PRO-8 + PRO-9):** the Free `deleteTask` flow (`closeTaskSheet()` + `deleteTask`) never sets `taskModifiedInSheet`. Every Pro view relying on "refetch on sheet close if modified" (Calendar, Gantt) misses task deletions. Sprint survives only because `sprintSlice` has an explicit `tasks/deleteTask/fulfilled`. Adding that handler to calendar/gantt slices — or setting `taskModified` on delete in Free — fixes both at once.

---

## 6. Cleanup checklist (post-QA)

- [ ] Delete `mu-plugins/zz-test-autologin.php` on both sites.
- [ ] Optionally drop the `we-pm-old.test` clone + `we_pm_old` DB when done.
- [ ] Test-created data on both: project 21 "QA Full Cycle", task 1471, members Dana/Ed on project 21 (new UI only).

---

## 7. Recommendations (priority order)

1. **PRO-1 (module toggle)** — highest user impact; toggling a module currently does nothing visible without reload. Drive registration off live Redux `activeModules`, or reload after toggle as an interim.
2. **Member-cache root cause (FREE-1 + FREE-2)** — dispatch `invalidateProjectCache(projectId)` + `invalidateProjectAssignees(projectId)` on member add/remove/role-change. Both invalidators already exist; wiring them clears both High findings.
3. **PRO-6 (sprint edit)** — add `updateSprint.fulfilled` or `onRefresh()` in `handleUpdate`.
4. **deleteTask root cause (PRO-8 + PRO-9)** — set `taskModifiedInSheet` on delete in Free (or add `tasks/deleteTask/fulfilled` to calendar + gantt slices) — clears both ghost-item findings at once.
5. **PRO-2/PRO-10** — patch `task.labels.data` on label edit/delete; gate timer `isRunning` on `task_id`.
6. **Convention:** every id-keyed entity cache must be invalidated by the mutation that changes it; never keep the same entity in two caches without a write-through.
7. **Cleanup:** remove the dead reducers/slices (FREE-4/5/6, PRO-5, PRO-12) or wire them to their intended flows.

---

## 8. Audit method

- 3 parallel code auditors swept all **21 Redux slices** (9 free + 12 pro) + their consumer components, in both the `ui-modernization` and `develop` trees.
- Pattern hunted: fetch-once caches never invalidated · mutation `.fulfilled` that doesn't update the list · dead `clear*/reset*/invalidate*` reducers · same entity cached twice · cross-view mutations not propagated.
- Every finding cites exact file:line and was confirmed by reading the code, not just grep. FREE-1 was additionally **reproduced live** in the browser (§2/§4).
- Coverage confirmed **clean** (no refresh bug): tasksSlice sync-back, Kanban board reloads, My Tasks refetch, MilestonesPage, settings task-types, templates, invoice create/update/pay/delete, reports, progress, calendar task-sync, WooProjectPage, google-workspace capability values.

### Verification pass (one-by-one)

All 16 findings re-checked line-by-line against the current code — **every one confirmed**, none rejected:

| Finding | Confirmed | Key line(s) |
|---|---|---|
| FREE-1 | ✓ | `useCurrentProject.js:5` Map cache, `:38` `invalidateProjectCache` (dispatched 0×); ProjectOverview add-member uses `setProject(prev…)` only |
| FREE-2 | ✓ | `useProjectAssignees.js:15` guard; `invalidateProjectAssignees` dispatched 0×; sole consumer `KanbanBoard/index.jsx:51` |
| FREE-3 | ✓ | `projectsSlice.js:120` `categoriesLoaded` guard; `CategoriesPage.jsx:42` local `useState` |
| FREE-4/5/6 | ✓ | `clearLists`/`clearListComments`/`clearDragState` dispatched 0× |
| PRO-1 | ✓ | `modulesSlice.js:69-75` mutates `activeModules` only; `index.jsx:40-91` `isModuleActive` gates registration once at import |
| PRO-2 | ✓ | `labelsSlice.js:82-91` → `state.labels` only; `ProTaskLabelBadges.jsx:12` reads `task?.labels?.data` |
| PRO-3 | ✓ | `LabelsTab.jsx:22` local `useState`, `:98/:101/:115` direct `proApi` |
| PRO-4 | ✓ | `sendInvoiceEmail` no fulfilled reducer; `InvoicePage.jsx:99-101` `handleEmail` no `fetchInvoices` |
| PRO-5 | ✓ | `setCurrentInvoice`/`resetInvoices`/`setLabels`/`resetLabels`/`resetReports`/`resetCalendar` dispatched 0× |
| PRO-6 | ✓ | `sprintSlice.js` no `updateSprint.fulfilled` (only `updateSprintStatus.fulfilled:150`); `SprintItem.jsx:119-120` `handleUpdate` no `onRefresh` |
| PRO-7 | ✓ | `removeTaskFromSprint.fulfilled:216-227` filters arrays, never touches `sprint.meta`; `SprintItem.jsx:166` branch no `onRefresh` |
| PRO-8 | ✓ | `calendarSlice.js` has update/status/fetch fulfilled, no `tasks/deleteTask/fulfilled`; `TaskDetailSheet/index.jsx:453-455` delete = `closeTaskSheet()`+`deleteTask`, no `markTaskModified` |
| PRO-9 | ✓ | `GanttChart/index.jsx:164-169` reload gated on `taskModified` (never set by delete) |
| PRO-10 | ✓ | `clearRunningTimer` dispatched 0×; `Timer.jsx:41` `isRunning` = global `runningTimer.running`, no `task_id` check |
| PRO-11 | ✓ | `subtasksSlice.js:145-147` `promoteSubtaskToTask.fulfilled` only filters subtask, discards `newTask`/`listId` |
| PRO-12 | ✓ | `ganttSlice` `createLink`/`deleteLink` unused in components (only a code comment in ProFilesPage) |
