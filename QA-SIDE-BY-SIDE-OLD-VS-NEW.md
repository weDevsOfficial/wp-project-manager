# WP Project Manager — Side-by-Side Test (Old UI vs New UI)

- **New UI** = `we-pm.test` (ui-modernization + all fixes)
- **Old UI** = `we-pm-old.test` (develop + all fixes, identical cloned data)
- Legend: ✅ verified live · ⚙️ code+build verified (not re-clicked) · 🔁 parity (same shared code path)

## Module: Projects
| Case | New UI | Old UI | Notes |
|---|---|---|---|
| Create project (via UI) | ✅ id 21 | ✅ id 21 | parallel create, identical id |
| Add team member | ✅ Dana/Ed/Amy | ✅ Amy | role step (Manager) both |
| **Member appears in task picker, no reload** (FREE-1/2 fix) | ✅ | ✅ | **fixed + verified both** |
| Category filter after CRUD (FREE-3 fix) | ⚙️ | ⚙️ | invalidateCategories dispatched; built |
| Overview stats (tasks/completed/%) | ✅ | ✅ | render identical; layout differs |
| Filter tabs | All-first | Active-first | cosmetic order diff |

## Module: Task Lists
| Case | New UI | Old UI | Notes |
|---|---|---|---|
| Auto "Inbox" list on create | ✅ id 231 | ✅ id 231 | identical |
| Add task | ✅ 1471, 1472 | ✅ 1471 | id parity |
| New List button | ✅ | ✅ | present both |

## Module: Tasks
| Case | New UI | Old UI | Notes |
|---|---|---|---|
| Add task | ✅ | ✅ | |
| Assign member | ✅ Dana (1472), admin+Dana (1471) | ✅ | wp_pm_assignees rows |
| Complete (status toggle) | ✅ status=1 | ✅ status=1 | completed_at set |
| Subtask add | ✅ "Subtask One" | 🔁 | Pro slot; same component |
| Comment add | ✅ 2 comments | 🔁 | Tiptap editor |
| Real-time: complete → list group/%/count | ✅ 1/1 100% | 🔁 | live while sheet open |
| Task detail layout | **centered modal** | **right slide-over** | main visual diff |

## Module: Kanban
| Case | New UI | Old UI | Notes |
|---|---|---|---|
| Board renders (Backlog/In-Progress/Review/Done) | ✅ | 🔁 | columns + cards |

## Module: Sprints
| Case | New UI | Old UI | Notes |
|---|---|---|---|
| Sprint list + create modal | ✅ | 🔁 | per-project filter |
| Sprint edit reflects on card (PRO-6 fix) | ✅ | ⚙️ | **new UI live: edit title → card shows "fsdf EDITED", no reload** |
| Remove-from-sprint stats refresh (PRO-7) | ⚙️ | ⚙️ | onRefresh on remove branch |

## Module: Modules (Pro toggle)
| Case | New UI | Old UI | Notes |
|---|---|---|---|
| Toggle module → nav/route applies (PRO-1 fix) | ⚙️ | ✅ | **old UI live: toggle → auto-reload → "Sprints" nav removed/added** |

## Module: Time Tracker
| Case | New UI | Old UI | Notes |
|---|---|---|---|
| Timer no longer bleeds across tasks (PRO-10) | ⚙️ | ⚙️ | isRunning gated on task_id |

## Module: Calendar / Gantt
| Case | New UI | Old UI | Notes |
|---|---|---|---|
| Task delete via sheet drops ghost event/bar (PRO-8/9) | ⚙️ | ⚙️ | markTaskModified on delete |

## Module: Invoices
| Case | New UI | Old UI | Notes |
|---|---|---|---|
| Email invoice refreshes row (PRO-4) | ⚙️ | ⚙️ | fetchInvoices after email |

## Module: Settings → Labels
| Case | New UI | Old UI | Notes |
|---|---|---|---|
| Label CRUD syncs shared slice (PRO-3) | ⚙️ | ⚙️ | fetchProjectLabels after save |

## Summary
- **License active** on both (all Pro modules present).
- **Data identical** (cloned) — every DB check matched between sites.
- **9 real-time fixes** applied on develop, merged to ui-modernization, present on both.
- **Behavior parity** across modules; only intentional **layout** differences (Dashboard nav item, centered-modal vs right-sheet task detail, filter order, card meta wording).
- **Not yet drilled live on both** (⚙️ rows): Calendar/Gantt/Invoice/Timer/Label/Sprint-edit — code+build verified; can be clicked through on request.
