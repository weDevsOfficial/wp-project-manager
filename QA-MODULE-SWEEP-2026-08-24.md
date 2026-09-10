# WP Project Manager — AI Settings Fix + Full Module Functional Sweep

Date: 2026-08-24
Env: new UI `we-pm.test` (ui-modernization + Pro, Business license) · old UI `we-pm-old.test` (develop clone)
Method: real browser testing (Playwright); DB used only for root-cause probing, not for pass/fail sign-off.

---

## 1. AI Settings — "No models available" (backend bug, FIXED)

**Symptom:** AI Settings → OpenAI (or Google) provider → Model dropdown missing, red text *"No models available for this provider. Please verify your API key and save again."* Key valid, Test Connection passes.

**Root cause (backend only — frontend renders exactly what backend returns):**
`src/Settings/Controllers/AI_Settings_Controller.php` caches the model list in the `pm_ai_models_cache` transient (24h). Two defects:

1. **`index()` never refetched a missing provider.** Anthropic ships a *static, always-present* model list, so once the cache existed the guard `empty($cached_models['models'])` was never true again → OpenAI/Google were never re-fetched for the whole 24h cache life. A single network blip on the first fetch poisoned the provider for a day.
2. **`store()` never busted the cache on API-key save.** Incoming settings key is the literal `ai_api_key` (provider suffix added later in the same method), but the cache-bust guard matched `strpos($key,'ai_api_key_')===0` (trailing `_`) → it never fired.

**Evidence chain (old UI):** Test Connection ✅ 200 · decrypt stored key ✅ `sk-proj…` · direct OpenAI `/v1/models` ✅ 200/98 gpt models · `GET /pm/v2/settings/ai?provider=openai` ❌ `models.openai:[]` · Redux `settings.aiModels.openai` ❌ `[]`. Rebuilding the cache made the dropdown return instantly (102 models) → frontend confirmed correct.

**Fix (ported from ui-modernization to develop):**
- `index()`: refetch when the *selected provider* has no models (not only when the whole cache is empty), then re-read `$models` so the fresh list ships in the same response.
- `store()`: match `strpos($key,'ai_api_key')===0` and **clear** the cache before rebuild.

**Runtime verification (browser):** anthropic-only stale cache → single GET now refetches → `openai:102` (was `[]`, 172ms no-fetch → 1444ms fetch). Save with `ai_api_key` → cache busts + rebuilds `0→102`. Verified on old UI (develop) and new UI (ui-modernization).

**AI features end-to-end (browser):**
- AI **project generation** (old UI): prompt → 9 task lists / 72 tasks → project created.
- AI **subtask generation** (new UI, Pro): task 975 → 5 subtasks generated + added + persisted.

**Delivery:** issue `weDevsOfficial/pm-pro#474` `[FREE]` · PR `weDevsOfficial/wp-project-manager#667` (base develop, Closes #474) · merged into local develop `f4f888f74`, pushed to fork · ui-modernization already carried the identical fix (byte-diff empty). Board: project 29, Sprint 40, Product WPPM, Status Dev: Done, Est 1h.

---

## 2. New-UI top-bar enlargement (ui-modernization only)

The two page-level top navigation bars scaled up (bigger padding, `text-sm` labels, 18px icons, roomier container), keeping the segmented pill design; both bars share identical sizing:
- `admin-settings/SettingsPage.jsx` — Settings tab nav (heading → `text-2xl`).
- `layout/ProjectSubNavBar.jsx` — project sub-nav (Task Lists…Settings).

Scope limited to real top bars (both in a `shrink-0 … border-b` header). Inline filter/segmented controls (MyTasks, Projects, Files, Milestone filter, TaskDetail inner tabs) intentionally untouched. Built Free + Pro, verified live. Commit `cc1b58f07`, pushed to fork ui-modernization.

---

## 3. Full module functional sweep (new UI, all browser-verified)

### Sprint — FULL
| Op | Result |
|---|---|
| Create (title/dates/project) | ✅ appears Active |
| Edit title (PRO-6) | ✅ card updates live |
| Import task (add) | ✅ 2 tasks in sprint |
| Remove from sprint (PRO-7) | ✅ refreshes → 1 task |
| Complete | ✅ moves to Completed Sprints tab |
| Delete | ✅ removed |

### Milestone — FULL
| Op | Result |
|---|---|
| Create | ✅ |
| Mark Complete | ✅ Completed count→1, live |
| Edit/rename | ✅ live |
| Delete | ✅ counts 4→3, live |
| Link Tasks / Make Private | present, not exercised |

### Kanban — FULL
| Op | Result |
|---|---|
| Board render | ✅ Backlog/In Progress/In Review/Done |
| Add card | ✅ |
| Drag card Backlog→In Progress | ✅ persisted after reload, counts 11/11 → 10/12 |
| Add column | ✅ |
| Rename column (dbl-click) | ✅ |
| Import — "Search & add existing task" | ✅ added off-board task to column (count 0→1); search correctly excludes tasks already on the board (on-board title → "No tasks found") |
| Remove card | control present |

### Modules / Subtasks / others
| Area | Result |
|---|---|
| Modules toggle (PRO-1) | ✅ Gantt off→nav drops→on, auto-reload |
| Subtask AI-gen | ✅ 5 |
| Subtask manual add | ✅ |
| Subtask complete-toggle | ✅ (subtask status is STRING `complete`/`incomplete`, not int 0/1) |
| Subtask promote-to-task (PRO-11) | ✅ standalone task, live refresh in list |
| Comment add | ✅ Tiptap |
| Gantt render | ✅ |
| Invoices — FULL | ✅ create (item Consulting $100×2, live calc → $200) · view (full detail, Due $200/Paid $0) · Enter Payment → status **Paid**, Due $0, list refreshed live. Download PDF / Send Email / Edit / Delete present (Send Email not fired — no client email set) |

---

## 4. Minor findings

1. **Kanban drag a11y** — screen-reader live-region announced *dropped the card into the "undefined" column* (target name unresolved when dropping onto a card). **FIXED** — `resolveOverColumnName()` in `kanban/index.jsx` maps the hovered card's column id → name; now reads the real column ("Backlog"). Issue pm-pro#475, PR wp-project-manager#668, develop merge `ff4f55e0d`, ui-modernization `f4dda5d21`. Verified in browser.
2. **Time Tracker** — timer control renders only when the current user is an assignee of the task (by design). Confirmed: timer was absent on task 975 until Administrator was added as assignee, then it appeared; start counted up (00:00:16), stop recorded a time-log row (Administrator · Aug 24 · 00:00:16, Net Total 00:00:16). PRO-10 scoping correct.

## 5. Remaining modules — tested one-by-one (browser)
| Module | Op | Result |
|---|---|---|
| Discussions | create (title + Tiptap body) | ✅ count 1→2, opens in detail |
| Files | upload a file | ✅ qa-upload-test in Recent Files, uploaded by Administrator |
| Labels (project settings) | create label | ✅ "QA-Label" in list w/ Edit |
| Custom Fields (project settings) | add field (Text) | ✅ "QA Field" in list |
| Task Types (global settings) | create type | ✅ "QA-Type" in table |
| Calendar | render + Month→Week switch | ✅ "August 23–29, 2026" |
| Time Tracker | assignee-gated timer start/stop → log | ✅ 00:00:16 logged |

## 7. Admin / views / labels — tested (browser)
| Area | Op | Result |
|---|---|---|
| Labels PRO-2/3 | apply QA-Label to task 975 → enable "Show Labels in Tasks List" → row badge | ✅ badge renders on task row |
| Categories | create | ✅ "QA Category" |
| Reports | Summary run (Aug 1–31) | ✅ 425 tasks / 168 completed, est-hours, per-project + subtask tables, chart, Export CSV |
| Progress | activity timeline | ✅ 56 entries render |
| Templates | page render | ✅ New Template + search |
| Tools (Import) | page render | ✅ Trello import UI |
| Overview (project) | dashboard render | ✅ progress 25/52 48%, stat cards, Progress-Over-Time chart, milestones table, 9 members |

## 8. Cross-role permissions + module on/off (browser + server trace)
Switched users via the temp autologin shim; verified UI **and** traced `Access_Project` server-side.

| Role / user | Result |
|---|---|
| **Admin** (uid 1) | full access ✓ |
| **Co-Worker member** (demo_editor uid 13, project 14) | project access ✓; Administration nav (Categories/Settings/Tools/Templates/License) **hidden** ✓; **Modules page → "Access denied"** ✓ |
| **Client member** (uid 16) | `view_project` true (member) ✓ |
| **Non-member, clean** (uid 27, subscriber, no `pm_manager`, not in project) | `view_project(14)`=false → **Access_Project DENY** ✓ |
| **`pm_manager` cap holder** (uid 10/9/6) | all-project access — **by design** (PM administrator cap) |

**No broken-access-control.** Initial suspicion (a subscriber reading project 14 by id) traced to test data: uid 10 holds the `pm_manager` cap (grants all-project access by design) and uid 16 is actually a project-14 Client member. A truly unprivileged non-member (uid 27) is correctly **denied** at `Access_Project` (`libs/functions.php::wedevs_pm_user_can('view_project')` returns false for non-members).

**Module on/off** (admin): toggle Sprint OFF → PRO-1 auto-reload → "Sprints" nav removed; toggle ON → nav restored. Same verified earlier for Gantt. Module management is admin-only (co-worker denied).

Minor UX bug (**FIXED**): the "Modules" nav link was shown to Co-Workers even though the page returns "Access denied". Gated the sidebar Modules section on `isAdmin` (`AppSidebar.jsx`), matching Administration. Verified: Co-Worker no longer sees Modules nav; Admin unchanged. Issue pm-pro#476, PR wp-project-manager#669, develop merge `c6eb001c2`, ui-modernization `4f05e3d54`.

Test-data note: some demo subscribers carry the `pm_manager` cap (seed noise), which legitimately grants all-project access.

---

## Bugs found + fixed this session (all shared → develop, synced to ui-modernization, boarded Sprint 40 / WPPM / Est 1h each)
| Issue | PR | Bug |
|---|---|---|
| pm-pro#474 | wp-project-manager#667 | AI Settings OpenAI/Google models never load (cache never refetched + save never busts) |
| pm-pro#475 | wp-project-manager#668 | Kanban drag announces "undefined" column to screen readers |
| pm-pro#476 | wp-project-manager#669 | Modules nav item shown to non-admins |

## 9. Not exercised (need external creds/services): Google Workspace / GitHub / Notion / Loom / Pusher / Trello-import / Stripe / WooCommerce / BuddyPress integrations; Invoice Send Email (no client email set).

## 6. Test artifacts left on new UI
Project 14 (Analytics Sprint): kanban card "QA kanban card — verify persist" now in In Progress; empty column "QA Column Renamed"; task 975 has AI subtasks + a comment; milestone/sprint test objects were deleted during their delete tests.
