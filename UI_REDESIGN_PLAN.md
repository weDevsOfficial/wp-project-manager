# WP Project Manager — UI Redesign Plan

**Goal:** Kill the "AI-generated" look (CTO feedback) and reskin Free + Pro to the reference
direction: light sidebar, warm coral primary, soft pastel badges, calmer surfaces, roomier
radius. Refactor the design system in place — **no functionality changes, no Free↔Pro
contract breaks.**

References:
- **img1** — grouped project list + light sidebar + "Become Pro" upsell card
- **img2** — project listing card/grid view
- **img3** — task detail sheet (split view: grouped list + right detail panel)

## RESOLVED DECISIONS (final)

> **SCOPE = DESIGN ONLY.** Keep all existing data, fields, API, logic, permissions, Redux
> wiring UNCHANGED. No new DB columns, no new backend, no invented UI data. Reference designs
> guide LOOK only; where a ref shows a field WePM lacks (client, project priority, task
> priority, task attachments), OMIT it — never fabricate. Every change is visual/CSS/markup.


- **Topbar = WHITE in light mode**, dark only in dark mode. NO dark topbar, NO full-width-top
  restructure. Keep current AppLayout structure (sidebar full-height + topbar over content).
  Just polish topbar + flip accent.
- **Sidebar is already light** (`bg-pm-surface` = #FFFFFF). Navy `--pm-sidebar*` tokens are
  vestigial (unused in layout code). "AI look" = purple accent + 6px radius + Inter, not a dark
  sidebar. Add the **"Become Pro" card** in AppSidebar footer (`!collapsed` + `!isPro` gate;
  hidden on frontend via existing `!isFrontend`).
- **Project list (img1 grouped view) columns** = Project / Description / Deadline
  (`est_completion_date`, exists) / People / Progress, grouped by status with colored headers +
  counts + collapse + `＋`. **OMIT Client & Priority** (no project data). Don't invent columns.
- **Task sheet (img3)**: adopt layout; Comments+Activity → **Comments/Updates tabs** (UX win);
  **Time Spent bar = Pro slot** (`task.detail.inline-properties`), Free shows nothing;
  Priority pill + task-level Attachments = **omit for now** (no free data — build later only if
  asked). Keep per-comment attachments as-is.
- **Interactivity / UX (user directive):** hover/active states, collapsible groups, keyboard
  focus, empty states, loading skeletons, toasts — apply throughout. Verify usable in BOTH
  Free-only and Free+Pro before "done".
- **CRLF** on `.css`/`.js`/`.jsx` in both repos — preserve (CRLF-safe edits).
- Color inventory: ~180 hex exist but MOST are integration/brand/chart colors — LEAVE THEM.
  Only repoint the **purple family** to coral (verified list): Free ~23 spots
  (`#7C3AED #6D28D9 #6366f1 #a78bfa #4F46E5 #625DF5 #5B56D7 #C444FB`) + Pro 5 spots
  (`#7c3aed #a78bfa`). Plus `bg/text-{purple,violet,indigo}-*` utilities in ~20 files.

## Locked decisions (from user):
- **Primary = coral + neutral** (coral action buttons, green brand mark, soft pastel badges)
- **Sidebar = light** (white/near-white, dark text, tinted active pill) — matches both refs
- **Icons = Hugeicons `stroke-rounded`** (replace lucide-react)
- **Typeface = Mona Sans** (replace Inter; self-hosted variable font, OFL)
- **Radius = `0.625rem` (10px)** via `--radius` only (cards 10px / buttons·inputs 8px / small 6px)
- **Token-only reskin — DO NOT edit `components/ui/*` primitives.** Pro consumes them at
  runtime; changing them risks the contract. All restyle rides tokens + `tailwind.css` +
  call-site classes on FEATURE components (sidebar, projects page, task sheet).
- **Free part built with shadcn** (already is; leave primitives, retune tokens)

---

## 0. Guardrails (must hold the whole way)

- **Tokens are shared.** CSS variables are defined ONCE in Free
  `wedevs-project-manager/views/assets/src/tailwind.css` (`:root` + `:root[data-pm-theme="dark"]`).
  Pro only *references* them. Reskin = edit Free token block + both `tailwind.config.js` maps.
- **Do not break `window.PM`.** Contract in `views/assets/src/index.jsx` + `.claude/rules/free-pro-bridge.md`.
  Restyle primitives internally; keep their exported names, props, and variant APIs identical.
  Run `/free-pro-contract-check` before any commit touching `index.jsx`, `useSlot.js`,
  `store/index.js`, `routeRegistry.js`, or `@components/common/*` / `@components/ui/*`.
- **CSS isolation stays.** Scope `#wedevs-project-manager`, preflight OFF, `important:true`,
  z-index ≤ 700, `pm-` prefix, banned class names, Radix portals → `#pm-portal-root`.
- **Never hand-edit `views/assets/dist/`.** Rebuild via `pnpm build`.
- **CRLF line endings** on both repos — keep them (don't let the editor normalize to LF).
- Pro's shared primitives (button/input/dialog/sheet/select + common/*) resolve to Free at
  runtime via webpack externals. Restyle those in **Free**; Pro inherits automatically.
  Pro-OWNED primitives to also touch: `pm-pro .../components/ui/{badge,card,table,chart,pagination,command,context-menu,color-picker}.jsx`.

---

## 1. Design tokens (the global reskin)

Edit **Free** `views/assets/src/tailwind.css` `:root`:

| Token | Old | New | Note |
|---|---|---|---|
| `--primary` (HSL) | `262 80% 57%` (#7C3AED purple) | `9 83% 65%` (#F26D5B coral) | shadcn primary + buttons |
| `--ring` | `262 80% 57%` | `9 83% 65%` | focus ring coral |
| `--radius` | `0.375rem` (6px) | `0.625rem` (10px) | roomier, ref pills/cards |
| `--pm-sidebar` | `#1A1A2E` navy | `#FFFFFF` | **light sidebar** |
| `--pm-sidebar-hover` | `#16213E` | `#F4F4F5` | |
| `--pm-sidebar-active` | `#0F3460` | `#FDECE8` | coral-light tinted pill |
| `--pm-sidebar-text` | `#A8B2D8` | `#52525B` | zinc-600 |
| `--pm-sidebar-txt-active` | `#FFFFFF` | `#18181B` | near-black |
| `--pm-surface` | `#FFFFFF` | `#FFFFFF` | keep |
| `--pm-surface-muted` | `#F7F8FA` | `#F4F4F5` | page canvas gray |
| `--pm-border` | `#E5E7EB` | `#E4E4E7` | zinc-200 |
| `--pm-hover` | `#F3F4F6` | `#F4F4F5` | |
| `--pm-accent` | `#7C3AED` | `#F26D5B` | coral |
| `--pm-accent-hover` | `#6D28D9` | `#E05543` | |
| `--pm-accent-light` | `#EDE9FE` | `#FDECE8` | |
| `--pm-text` | `#1F2937` | `#27272A` | |
| `--pm-text-muted` | `#6B7280` | `#71717A` | |
| `--pm-text-primary` | `#111827` | `#18181B` | |
| `--pm-brand` (NEW) | — | `#22C55E` | green logo/brand mark only |

Add new status/priority pastel tokens (currently hard hex in `tailwind.config.js`) — keep as
config colors but retune to soft pairs (bg + text):

| Badge | bg | text |
|---|---|---|
| priority-high | `#FCE7EB` | `#E11D48` |
| priority-medium | `#FEF3C7` | `#B45309` |
| priority-low | `#DCFCE7` | `#15803D` |
| priority-urgent | `#FEE2E2` | `#DC2626` |
| status-todo | `#F1F1F2` | `#52525B` |
| status-ip (progress) | `#FEF3C7` | `#B45309` |
| status-review | `#EDE9FE` | `#7C3AED` |
| status-done | `#DCFCE7` | `#15803D` |
| status-late | `#FEE2E2` | `#DC2626` |

**Dark mode:** retune `:root[data-pm-theme="dark"]` — swap purple accent for coral
(`--primary: 9 78% 62%`), keep dark sidebar dark but shift to neutral zinc (`#18181B`) not navy.

Mirror the two `tailwind.config.js` files if any new named tokens are added (`pm-brand`,
badge bg/text pairs). No structural config change.

---

## 2. Icons — migrate lucide-react → Hugeicons stroke-rounded

- Add deps (both repos): `@hugeicons/react`, `@hugeicons/core-free-icons`.
- API differs from lucide (`<Search/>` → `<HugeiconsIcon icon={Search01Icon}/>`), so we add an
  **adapter** to avoid touching 181 call sites blindly:
  - New `views/assets/src/components/ui/icon.jsx` — wraps `HugeiconsIcon`, default
    `strokeWidth`, `size`, `stroke-rounded` variant, `className` passthrough.
  - New `views/assets/src/lib/icon-map.js` — maps the lucide names currently used
    → Hugeicons equivalents (one lookup table; grep the 96/85 files for the exact set).
- Migration = codemod per file: replace `import { X } from 'lucide-react'` +
  `<X className=.../>` with `<Icon name="x" .../>`. Do it area-by-area (§4 phases), rebuild
  and eyeball each area before moving on.
- Keep `lucide-react` installed until the last area is migrated, then remove.
- **Free = 96 files, Pro = 85 files.** Highest-traffic first: layout shell, projects, tasks,
  ui primitives.

---

## 2b. Typeface — Inter → Mona Sans

- **Self-host** the variable font (no external CDN — CSP/offline safe for WP). Drop
  `MonaSans[wght,wdth].woff2` (+ italic) into `views/assets/src/fonts/` (Free), add `@font-face`
  at the top of `views/assets/src/tailwind.css` (weight `200 900`, width `75 125`,
  `font-display: swap`).
- Update `fontFamily.pm` in **both** `tailwind.config.js`:
  `['Mona Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']`.
- Update the hard-coded `font-family: Inter, …` strings in Free `tailwind.css`
  (`#wedevs-project-manager`, `[data-radix-popper-content-wrapper]`, `[role="dialog"]`,
  `[role="alertdialog"]`, alert-dialog button reset) → `Mona Sans, …`.
- Pro portals inherit via the shared vars; grep Pro `tailwind.css` for any `Inter` literal too.
- Mona Sans is wider/rounder than Inter — recheck sidebar/nav truncation and button min-widths
  after swap.

## 3. Primitives — DO NOT EDIT (token-driven)

Primitives in `components/ui/*` are stock shadcn: they already read `bg-primary`, `bg-card`,
`border`, `rounded-lg/md`, `ring-ring`. **They are NOT edited.** The reskin reaches them
entirely through the tokens in §1 (coral primary, 10px radius, calmer border, coral ring).

- button → coral primary + 8px radius: comes free from `--primary` + `--radius`.
- card → 10px radius + card token: comes free from `--radius` + `--card`.
- badge default/secondary/etc. → token-driven; no edit.
- input/select/tabs/avatar/progress/dropdown/dialog/sheet → all token-driven; no edit.

**Pastel priority/status badges** (the biggest "AI look" fix) are NOT badge.jsx variants —
they render in FEATURE code via the color logic in `ProjectsPage/utils.js`,
`components/tasks/TaskLabelBadges.jsx`, and Pro `ProTaskLabelBadges.jsx`. Retune the pastel
pairs THERE (call sites / util), not in the primitive. Same rule for Pro-owned
`badge/card/table/pagination/chart` — only touch if they hardcode the old purple/hex; prefer
routing them through tokens.

---

## 4. Screen-level work (phased)

### Phase A — Tokens + primitives (foundation)
Items §1 + §3. Rebuild, smoke-test that nothing visually regresses hard. Everything downstream
rides on this.

### Phase B — App shell (light sidebar + topbar)
`components/layout/`:
- **AppSidebar.jsx** — light bg, dark text, coral-tinted active pill (or left accent bar),
  section labels (uppercase muted), collapsible project tree (ref img1), **"Become Pro"
  upsell card pinned bottom** (reuse `PromoBanner`/`ProUpgradeModal`), brand mark green.
- **TopBar.jsx** — light, breadcrumbs left, global search center, icon actions + avatar right,
  coral "New Project". (Keep light per locked decision; dark-topbar variant = future option.)
- **ProjectSubNavBar.jsx** — pill/underline tabs matching new `tabs` style.
- **FrontendLayout.jsx** — same treatment for shortcode/front-end shell.

### Phase C — Project listing (img1 + img2)
`components/projects/ProjectsPage/index.jsx` + `utils.js`:
- **Grid/Card view (img2)** — refined cards: title, progress bar + `x/y (n% completed)`,
  assignee stack, deadline w/ calendar icon, soft tag pills, pin star, `⋯` menu. `rounded-xl`,
  `shadow-sm`, `gap-5`.
- **List/grouped view (img1)** — group rows by status (TO DO / ON PROGRESS / IN REVIEW / …)
  with colored group headers + counts, columns Project/Client/Description/Deadline/People/Priority.
- Filter tabs w/ counts, List/Card toggle, search, sort — restyled, no logic change.
- Preserve all Redux wiring (`fetchProjects`, `toggleFavourite`, `deleteProject`,
  `toggleProjectStatus`, `viewMode`) and manager gating (`pmIsManager`).
- **DATA GAP (verified):** Free projects have no priority / client / deadline fields
  (`statusColor`/`statusLabel` in `utils.js` only). img1's Priority/Client/Deadline columns
  have no backing data. → Replicate img1 STYLE (grouped colored status headers + counts,
  People stack, soft pills) but keep columns to real fields: Project / Description / Progress /
  Members / Created / status-group. Don't invent columns. Grouping is presentation-only
  (bucket `projects` by status client-side) — no thunk/API change.
- Grid view already near img2 (`rounded-xl` cards, `Progress`, assignee stack, ⋯ menu,
  favourite star) — retune spacing/labels ("x/y (n% completed)"), not a rebuild.

### Phase D — Task detail sheet (img3)
`components/tasks/TaskDetailSheet.jsx` (Free) + Pro slots:
- Header: `Share` · `Expand` · `⋯` · close `X`.
- Eyebrow (list/section name + icon), large title.
- Priority pill + due-date pill row.
- **"Time Spent" gradient bar** (coral→lilac, mono time) — Pro Time Tracker via
  `task.detail.inline-properties` slot; Free shows nothing if Pro absent.
- Description block; **Attachments** list w/ colored icon tiles + View/Download.
- **Comments / Updates** tabs; comment composer pinned bottom.
- Subtasks stay in `task.detail.subtasks` slot (Pro). Keep sheet width/scroll behavior.

### Phase E — Remaining surfaces
My Tasks, Kanban cards, Milestones, Files, Discussions, Settings tabs, Reports/Progress/
Calendar (Pro), Invoices (Pro), Sprints (Pro), Gantt (Pro) — apply new primitives + badges +
icons. Mostly inherited from Phase A; spot-fix per screen.

---

## 5. Free / Pro safety checklist (per phase)

- [ ] `window.PM` exports unchanged (names, props, variants).
- [ ] Pro primitives that resolve to Free still match expected class hooks.
- [ ] `/free-pro-contract-check` clean.
- [ ] Build Free (`pnpm build`) → build Pro (`pnpm build`) → load with Pro active AND with Pro
      inactive. No console errors, no broken portals, dialogs/sheets/dropdowns still layered right.
- [ ] Dark mode still coherent.
- [ ] RTL (`pm-pro.css` has `-rtl`) not broken.

---

## 6. Build / verify

```bash
# Free
cd wedevs-project-manager && pnpm build && pnpm lint
# Pro
cd ../pm-pro && pnpm build
```
Manual verify with `/verify`-style drive: open projects list (grid+list), open a task detail
sheet, create a task, toggle dark mode, run once with Pro deactivated. Screenshot each ref-mapped
screen against img1/img2/img3.

---

## 7. Order of execution

1. Phase A (tokens + primitives) — Free, then mirror Pro config.
2. Icon adapter + migrate layout/projects/tasks areas (Phase-scoped).
3. Phase B shell → C listing → D task sheet → E remainder.
4. Contract check + dual build + manual verify after each phase.
5. Remove `lucide-react` once fully migrated.

**Nothing ships until Free builds, Pro builds against it, and both run with Pro on/off.**
