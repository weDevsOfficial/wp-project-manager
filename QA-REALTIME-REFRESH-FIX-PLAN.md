# Real-time "needs refresh" — Fix Plan

Branch: `fix/realtime-cache-invalidation` (both repos, base `develop`). PRs: wp-project-manager#666, pm-pro#473.
Principle: use existing actions/thunks; minimal diff; verify on **old (develop)** + **new (ui-modernization)** UI.

## Batch 1 — DONE + verified (both UIs)
| ID | Fix | File |
|---|---|---|
| FREE-1/2 | dispatch existing `invalidateProjectCache` + `invalidateProjectAssignees` on member add/role/remove | ProjectOverview.jsx |
| PRO-8/9 | dispatch existing `markTaskModified()` before `closeTaskSheet()` on delete → Calendar/Gantt drop ghost | TaskDetailSheet/index.jsx |
| PRO-6 | `updateSprint(...).then(onRefresh)` | SprintItem.jsx |
| PRO-7 | `onRefresh()` on remove-from-sprint branch | SprintItem.jsx |
| PRO-10 | gate timer `isRunning` on `runningTimer.task_id === taskId` | Timer.jsx |

## Batch 2 — THIS PASS
| ID | Sev | Fix approach (existing mechanisms) | File | Risk |
|---|---|---|---|---|
| FREE-3 | Med | add `invalidateCategories` reducer (reset `categoriesLoaded`) + dispatch after category create/update/delete/bulk-delete | projectsSlice.js, CategoriesPage.jsx | low |
| PRO-4 | Low | `dispatch(fetchInvoices(...))` in `handleEmail` (existing thunk) | InvoicePage.jsx | low |
| PRO-3 | Med-low | after LabelsTab save/delete, `dispatch(fetchProjectLabels(projectId))` so the shared slice re-syncs | LabelsTab.jsx | low |
| PRO-2 | Med | on label update/delete, patch every loaded `task.labels.data` via a taskListsSlice reducer (`patchLabelInLists`) dispatched from the label mutation | labelsSlice consumers / taskListsSlice.js | med (cross-slice) |
| PRO-1 | High | after `toggleModule` success, `window.location.reload()` — module reg is load-time (PHP localizes `active_modules` + JS registers once at boot); live re-registration is a larger refactor, reload is the correct low-risk fix (matches WP plugin-activation UX) | ProModulesPage.jsx | low |
| PRO-11 | Low-Med | on `promoteSubtaskToTask` success, dispatch a task-list insert with returned `newTask`/`listId` (or refetch target list) | MoveToTaskModal.jsx / subtasksSlice.js | med |

## Cross-check matrix (after build)
- FREE-3: create category → Projects filter shows it (no reload) — old + new.
- PRO-1: toggle a module → nav/route appears/disappears — old + new.
- PRO-4: email invoice → row status refreshes — old + new.
- PRO-2/PRO-3: edit label → task-row badge + pickers update — old + new.

## Deploy
Commit to `fix/realtime-cache-invalidation` → push (updates PRs) → clone (old UI) fast-forwards + rebuilds → ui-mod (new UI) re-applies + rebuilds → cross-check.

---

## STATUS (updated)

**Shipped to develop** (`fix/realtime-cache-invalidation`, PRs wp-project-manager#666 / pm-pro#473):
| ID | Commit | Verified |
|---|---|---|
| FREE-1/2 | free `55ad880b1` | ✅ live both UIs (add member → assignable, no reload) |
| PRO-8/9 | free `55ad880b1` | code + build |
| PRO-6/7 | pro `bec56a27a` | code + build |
| PRO-10 | pro `bec56a27a` | code + build |
| FREE-3 | free `2420cb987` | code + build |
| PRO-1 | pro `4f4de90e1` | ✅ live old UI (toggle → auto-reload → nav updates) |
| PRO-3 | pro `4f4de90e1` | code + build |
| PRO-4 | pro `4f4de90e1` | code + build |

**Merged develop → ui-modernization** (free `2a3dea71b`, pro `8a2732ff5`) — free import/toast conflicts resolved keeping ui-mod's richer toasts + the fix calls; pro auto-merged. Pushed to fork; new UI rebuilt + loads clean (no regression). Clone (old UI) fast-forwarded + rebuilt.

**Branch rationale:** all bugs pre-existing in BOTH develop + ui-modernization (identical logic) → all fixed on develop, merged up. No ui-mod-only fix required.

## PRO-2 + PRO-11 — DONE (pro `049396375`, PR pm-pro#473)
Both solved **without a new bridge API** — they dispatch Free's already-exposed `window.PM.thunks.fetchTaskLists({ projectId })` on the shared store (the same pattern MoveToTaskModal already used for `fetchTask`):
- **PRO-2**: `labelsSlice.updateLabel`/`deleteLabel` (covers the task-detail LabelManager) **and** `LabelsTab` save/delete (covers Settings) now refresh the task lists → task-row label badges update instead of ghosting.
- **PRO-11**: `MoveToTaskModal` refreshes the task lists after promote → the new task appears in the target list.
Build green on develop-fix, pro ui-modernization (`9c47b013a`), and the clone.

## Build-env note
Pro's generated `views/assets/src/free-base.generated.css` references `fonts/InterVF.woff2` / `InterVF-Italic.woff2`, but pro's `src/fonts/` was empty → build errored. Copied the two woff2 from the Free plugin's `src/fonts/` into pro `src/fonts/` (untracked, generated-asset dir). Pre-existing tooling gap (generation doesn't copy the fonts); flag for the build pipeline.

## ALL needs-refresh fixes complete (13 items)
FREE-1, FREE-2, FREE-3 · PRO-1, PRO-2, PRO-3, PRO-4, PRO-6, PRO-7, PRO-8/9, PRO-10, PRO-11.

## Not addressed (low / no user impact)
Dead reducers FREE-4/5/6, PRO-5, PRO-12 — remove as dead-code cleanup later.

---

## Addendum 2026-08-24 (separate from needs-refresh)
- **AI Settings models cache bug** (backend, develop) — OpenAI/Google never re-fetched once anthropic cached; key-save never busted cache. Fixed in `AI_Settings_Controller.php` (`index()` per-provider refetch + `store()` prefix `ai_api_key`). Issue pm-pro#474, PR wp-project-manager#667, local develop merge `f4f888f74`. Not a needs-refresh item.
- **New-UI top-bar enlargement** — SettingsPage + ProjectSubNavBar (ui-modernization, commit `cc1b58f07`).
- **Full module functional sweep** (Sprint/Milestone/Kanban/Modules/Subtasks/Comments/Gantt/Invoices) — see `QA-MODULE-SWEEP-2026-08-24.md`.
