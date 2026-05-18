---
name: "design"
description: "Redesign and modernize WP Project Manager UI — layout, spacing, typography, colors, visual hierarchy, component styling, responsiveness, animations. TRIGGER when the user says 'redesign', 'modernize UI', 'improve UX', 'update styling', 'visual refresh', invokes /design, or asks to improve the look/feel of any component or page. Do NOT trigger for logic, API, state, or backend changes."
---

# WP Project Manager UI Redesign Skill

## Objective

Modernize the UI visually. Zero changes to business logic, API, state, permissions, routes, or backend.

---

## Scope

### Safe to modify
- JSX markup structure
- Tailwind utility classes
- shadcn/ui presentation layer
- Spacing, typography, colors, visual hierarchy
- Responsiveness, interaction states, animations
- Component styling files under `views/assets/src/`

### Never touch
- `useApi`, `useSlot`, `useProApi`, `usePermissions` — hook behavior
- Redux slices, reducers, thunks, store shape
- Route definitions, `registerRoute`, `FilteredPage`
- Permission classes, backend PHP, DB logic, migrations
- `window.PM` bridge exports — any removal or rename breaks Pro
- Request payloads, response structures, Fractal includes
- `views/assets/dist/` — build output, never edit directly

---

## Non-Negotiable Technical Constraints

### API
All calls stay through `useApi()`. Never introduce `fetch()`, `axios()`, `XMLHttpRequest()`.
Auth headers must remain:
```js
X-WP-Nonce: PM_Vars.permission
is_admin: PM_Vars.is_admin
```

### Routing
HashRouter behavior unchanged. Route names intact:
```
/#/projects
/#/tasks
```

### CSS scope
All styles under `#wedevs-project-manager`. CSS vars on `:root`.

### Class naming
Every custom class prefixed `pm-`:
```
pm-sidebar  pm-task-card  pm-header  pm-kanban-column
```

### Forbidden class names (WP core collision)
```
.button  .active  .modal  .form  .card  .table  .spinner  .notice  .header
```

### z-index
Maximum `700`. Never exceed.

---

## Visual Direction

The UI should feel: **modern · clean · spacious · lightweight · SaaS-like · calm · focused**

Avoid: WP admin styling, crowded layouts, excessive borders, strong shadows, heavy gradients, glossy effects.

### Typography
- Font: Inter
- Strong hierarchy, 8-point spacing system, readable line heights, medium weights
- No tiny text, no cramped spacing

### Color system
```
Background:  #F8FAFC
Card:        #FFFFFF
Border:      #E5E7EB
Text:        #111827
Muted:       #6B7280
Primary:     brand color (use sparingly)
```
Use color intentionally: status, priority, CTA, alerts. Not decoration.

---

## Layout Principles
- Whitespace, alignment, hierarchy, modular sections
- Avoid dashboard clutter, too many cards, dense interfaces

## Reusable Patterns

Build toward consistent visual primitives:
```
PageHeader      FilterBar       SidebarNav
TaskRow         TaskCard        EmptyState
SectionHeader   ActivityItem    StatCard
```
No one-off inconsistent UI patterns.

---

## Component-Specific Rules

### Task rows
- Lightweight, quick-scan, subtle hover states
- No visual overload, no heavy borders, no unnecessary metadata
- Pattern: `drag handle → checkbox → title → assignees → due date → priority → comment count → menu`

### Kanban
- Smooth, clean, spacious, easy to scan
- Lightweight cards, soft shadows, subtle drag states
- No giant cards, no crowded metadata, no overly colorful columns

### Modals & drawers
- Prefer side panels, lightweight overlays, clean spacing
- No huge legacy modals, no excessive nested forms

### Empty states
Every major screen needs:
- Soft illustration or icon
- Concise message
- Clear CTA
- Never plain "No data found"

### Loading states
- Skeleton loaders, subtle shimmer, smooth transitions
- No blocking spinners everywhere

---

## Animation Rules
Subtle only:
- Preferred: fade, scale, slide, hover transitions
- Forbidden: bounce, flashy motion, excessive transforms

---

## Responsive Design
Must work on desktop, tablet, mobile.
- Sidebar behavior
- Task readability
- Kanban horizontal scrolling
- Spacing consistency

---

## Accessibility
Never remove for aesthetics:
- Keyboard navigation
- Focus states
- Contrast ratios (WCAG AA minimum)
- Semantic HTML structure

---

## Procedure

1. **Identify scope** — which component/page/view to redesign.
2. **Read current implementation** — understand existing JSX and class structure.
3. **Check CSS isolation** — confirm `#wedevs-project-manager` scope, `pm-` prefix, z-index ≤ 700.
4. **Apply changes** — Tailwind utilities, shadcn/ui primitives, updated markup structure.
5. **Verify no logic touched** — diff confirms only JSX/CSS/Tailwind changed.
6. **Check Free→Pro contract** — if editing a component exported via `window.PM`, run `/free-pro-contract-check`.
7. **Build** — `pnpm build`, confirm no errors.

---

## Philosophy

This skill is for **visual modernization only**.

Not:
- Feature redesign
- Architecture rewrite
- State management changes
- Backend optimization

Yes:
- Modern visual experience
- Better usability
- Improved hierarchy
- Premium SaaS feel
- Cleaner interactions

Preserve all existing functionality. Improve the entire visual experience.
