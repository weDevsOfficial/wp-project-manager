import { Outlet, useLocation } from 'react-router-dom'

// Overlay/detail URLs that render on top of the SAME page (task sheet,
// discussion detail) — stripping them keeps the page mounted so opening an
// overlay doesn't remount/re-animate the page (and doesn't reset the task
// sheet's URL-sync guards, which would loop). Real page changes still re-key.
function pageKey(pathname) {
  return pathname
    .replace(/\/tasks\/\d+\/?$/, '')             // task detail sheet overlay
    .replace(/\/discussions\/\d+\/?$/, '/discussions') // discussion detail pane
    // Tabbed pages own their sub-route: the tab is state inside a page that is
    // already mounted, so collapse it back to the page root. Without this every
    // tab click re-keys the Outlet, remounting the page and replaying the entry
    // cascade (and dropping scroll position and in-flight form state with it).
    .replace(/^(\/(?:settings|my-tasks|reports|sprints))(?:\/.*)?$/, '$1')
    .replace(/^(\/projects\/[^/]+\/settings)(?:\/.*)?$/, '$1')
}

// Wraps the routed <Outlet/> and re-keys it on page change so each new page
// fades/slides in. Keyed by a normalized pathname (not search/hash, not
// same-page overlays). Covers Free + Pro routes (both render through this
// Outlet). Motion is disabled via prefers-reduced-motion in CSS.
export function PageTransition() {
  const location = useLocation()
  const key = pageKey(location.pathname)

  return (
    <div key={key} className="pm-page-transition h-full">
      <Outlet />
    </div>
  )
}
