---
name: "free-pro-contract-check"
description: "Verify a change to the Free plugin does not break the window.PM contract that Pro depends on. Diffs window.PM exports, slot/filter/route registrations, externalized libs, and the shape of Free thunks/actions Pro consumes. TRIGGER when the diff touches views/assets/src/index.jsx, views/assets/src/hooks/useSlot.js, store/index.js, router/routeRegistry.js, or any file under @components/common that is re-exported via window.PM. Also TRIGGER when the user mentions Pro, asks 'will this break Pro', or invokes /free-pro-contract-check."
---

# Free → Pro Contract Check

The Free plugin is the host; Pro (`../pm-pro/`) attaches at runtime via `window.PM`. Any change to that surface can break Pro.

## Workflow

1. **Identify touched contract surfaces.** Read these files in the diff:
   - `views/assets/src/index.jsx` — `window.PM` object literal
   - `views/assets/src/hooks/useSlot.js` — `registerSlot/registerFilter/applyFilters/doAction/addAction/Slot/useFilter/useSlotFills`
   - `views/assets/src/store/index.js` — `store`, `injectReducer`, `resetProjectState`
   - `views/assets/src/router/routeRegistry.js` — `registerRoute`, `useRegisteredRoutes`
   - `views/assets/src/hooks/useNavRegistry.js` — `registerNavItem`, `useRegisteredNavItems`
   - Any file in `views/assets/src/components/common/` listed under `window.PM.components`
   - Any file in `views/assets/src/components/ui/` listed under `window.PM.ui`
   - Any file in `views/assets/src/lib/` listed under `window.PM.utils`

2. **Diff the `window.PM` shape.**
   ```
   git diff HEAD~1..HEAD -- views/assets/src/index.jsx | sed -n '/window\.PM/,/^}$/p'
   ```
   Classify each delta:
   - **Add** a new key — safe (additive).
   - **Remove** a key — BREAKING; flag and require Pro coordination.
   - **Rename** a key — BREAKING.
   - **Change a function signature** — BREAKING unless backward-compatible (new optional arg only).
   - **Change a re-export source** (e.g., shadcn primitive moved/renamed) — verify the same component is still exported under the same key.

3. **Verify the Pro webpack externals still resolve.** Read `../pm-pro/webpack.config.js`:
   - `react`, `react-dom`, `react/jsx-runtime` → `React`/`ReactDOM`/`['PM', 'libs', 'ReactJsxRuntime']`
   - `react-redux`, `react-router-dom`, `@reduxjs/toolkit`, `sonner` → `['PM', 'libs', '*']`
   - Every `@radix-ui/react-*` Pro uses → `['PM', 'radix', '*']`
   - The function external maps `@components/common/*`, `@components/ui/*`, `@lib/*` resolved paths to `['PM', '...', '...']`. If Free adds a new common/ui/lib re-export, Pro's map may need updating.

4. **Check slot/filter names.**
   ```
   grep -rn "registerSlot\|registerFilter\|Slot name" views/assets/src/
   ```
   - Slot names that Pro fills (search Pro repo): if Free removes a `<Slot name="X" />`, Pro's `registerSlot('X', ...)` becomes dead code.
   - Filter names: same logic for `useFilter('Y', ...)` vs Pro's `registerFilter('Y', ...)`.
   - Both sides must agree on the string literal — typos break silently.

5. **Check route registry shape.** `registerRoute(path, element)`:
   - If signature changes, Pro breaks.
   - If a previously-registered route is now declared statically in Free (the `dynamicRoutes.some(r => r.path === ...)` guards in `index.jsx`), confirm Pro's still-installed Pro-specific route doesn't clash.

6. **Check Redux contract.**
   - `injectReducer(key, reducer)` shape unchanged.
   - `store.dispatch({ type: 'global/resetProjectState' })` — if the action type changes, Pro's listeners break.
   - Any new Free thunk/action exposed under `window.PM.thunks` / `.actions` — additive only.

7. **Output.**

```
## Free → Pro contract diff

### Additive (safe)
- window.PM.foo — new field, no Pro impact.

### Breaking (requires Pro coordination)
- window.PM.bar — REMOVED. Pro repo `pm-pro/views/assets/src/.../X.jsx:Y` consumes it.

### Inspect manually
- Slot "task.detail.subtasks" body changed — Pro fill component may need to update props.

### Pro webpack externals
- All current externals still resolve.
```

## Hard rules

- **Never** rename or remove a `window.PM.*` key without coordinating with Pro.
- **Never** change a slot/filter/route NAME — add a new one if shape changes.
- **Never** stop externalizing a shared lib (React, Redux, Sonner, Radix) — duplicate instances break contexts.
- **Always** add to `.claude/rules/free-pro-bridge.md` when introducing a new public surface.
