# React Frontend Rules

## Component conventions

- **Functional + hooks only.** No class components.
- **File:** `.jsx` under `views/assets/src/components/<area>/<Name>.jsx`.
- **shadcn/ui first.** Compose from `@components/ui/*` before building custom UI.
- **Lazy-load pages.** Top-level route components use `React.lazy(() => import('...'))`. See `views/assets/src/index.jsx`.
- **Errors:** wrap risky tree boundaries in `<ErrorBoundary>` (from `@components/common/ErrorBoundary`).
- **i18n:** every user-visible string uses `@wordpress/i18n`:
  ```jsx
  import { __, sprintf, _n } from '@wordpress/i18n'
  __('Save', 'wedevs-project-manager')
  ```

## State

- **Redux Toolkit** for cross-component, async, persisted state. Slices in `views/assets/src/store/`.
- **`useState` / `useReducer`** for component-local UI state.
- **Selectors** via `useAppSelector(s => s.<slice>.<field>)`.
- **Dispatch** via `useAppDispatch()`.
- **Thunks** with `createAsyncThunk`. Name: `<feature>/<verb>` (e.g., `tasks/fetch`).
- **Pro slices** are injected at runtime via `window.PM.injectReducer('<key>', reducer)` — do NOT statically import Pro slice files from Free.
- **Reset on project change:** `dispatch({ type: 'global/resetProjectState' })`.

## API access — non-negotiable

- **Always** use `@hooks/useApi`. Never call raw `fetch`.
- Base URL comes from `PM_Vars.rest_url`. The hook injects:
  - `X-WP-Nonce: PM_Vars.permission` header
  - `is_admin: PM_Vars.is_admin` query/body param
- Fractal includes via `?with=relation1,relation2`. Never `?include=`.

## Data-type gotchas

| Field | Type sent to API | Reason |
|---|---|---|
| Task `status` | INTEGER `0`/`1` | Backend column is INT |
| Project `status` | STRING `'incomplete'/'complete'/'archived'/'favourite'` | Backend column is VARCHAR |
| User attach/detach | comma-separated STRING `'1,5,12'` | Backend trait expects string |
| Task `assignees` on update | full array | Partial replaces — wipes the rest |
| Task `estimation` | API returns SECONDS → ÷60 for minutes UI | Stored in seconds |

## CSS

- All custom classes prefixed `pm-`.
- Tailwind: utilities ARE `!important` (config) — no need for `!important` in handwritten CSS.
- Preflight is OFF. Don't rely on browser default-reset behavior.
- Banned class names: `.button .active .modal .form .card .table .spinner .notice .header`.
- z-index ≤ **700**.
- Radix portals: override `container` prop where supported, pointing to `#pm-portal-root`. Don't render to `document.body`.
- Toaster portal is the documented exception — it goes to `document.body` with explicit z-index in `index.jsx`.

## Hooks

- Custom hooks live in `views/assets/src/hooks/`.
- One concept per hook. Compose, don't expand.
- Key existing hooks:
  - `useApi` — REST wrapper
  - `useSlot` — Slot/Fill bridge + filters
  - `useProApi` — Pro-only requests
  - `usePermissions` — `isAdmin`, `isPro`, project role
  - `useNavRegistry` — Pro nav registration
  - `useConfirm` — promise-based confirm dialog
  - `useToast` — sonner wrapper
  - `useProjectAssignees`, `useCurrentProject` — shared queries
  - `useActiveProModules`, `usePmHooks`

## Routing

- React Router v6, **HashRouter** (`/#/projects`) — required for WP admin compatibility.
- Free routes in `index.jsx :: AppRoutes()`.
- Pro routes registered at runtime via `window.PM.registerRoute('<path>', element)`.
- Project routes wrapped in `<ProjectRoute>`, admin in `<AdminRoute>`, manager in `<ManagerRoute>`, license in `<LicenseRoute>`.
- "Replaceable" pages: `<FilteredPage filterName="route.<name>.element" fallback={Default} />` — Pro overrides via `registerFilter`.

## Pro gating

- Check `PM_Vars.is_pro` for capability gates, or use:
  - `<ProGate featureName="X" />` for inline placeholders.
  - `<ProFeaturePlaceholder ... />` for full-page placeholders shown when Pro hasn't registered a route.
- Pro components: `React.lazy()` and wrapped behind the gate.

## Build constraints

- Single chunk: `splitChunks: false`, `LimitChunkCountPlugin({ maxChunks: 1 })`.
- Bundle output: `views/assets/dist/pm.js`, `pm.css`. **Never** edit these by hand.
- jQuery is an external (still used by legacy parts) — don't bundle it.

## Testing

- Playwright specs in `tests/e2e-playwright/`.
- Cover golden path + the gotchas above (status as int, comma-separated users, Fractal `?with`).

## Anti-patterns

- ❌ Raw `fetch` (use `useApi`).
- ❌ `window.pmBus`, `window.pmChart*`, `window.PM_*` ad-hoc globals (deleted — use module-scoped event bus or Redux).
- ❌ `document.body` portal target (except the Toaster).
- ❌ Importing Pro internals from Free.
- ❌ Class components.
- ❌ Direct shadcn copy without using `@components/ui/`.
