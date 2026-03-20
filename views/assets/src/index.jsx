import React from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import { Provider } from 'react-redux'
import * as ReactRedux from 'react-redux'
import * as ReactRouterDom from 'react-router-dom'
import * as ReduxToolkit from '@reduxjs/toolkit'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { store, injectReducer } from '@store/index'
import { fetchTask } from '@store/tasksSlice'
import { AppLayout } from '@components/layout/AppLayout'
import { ProModalProvider } from '@components/common/ProUpgradeModal'
import { registerSlot, registerFilter, applyFilters, doAction, addAction, Slot, useFilter, useSlotFills } from '@hooks/useSlot'
import { registerRoute, useRegisteredRoutes } from '@/router/routeRegistry'
import { registerNavItem, useRegisteredNavItems } from '@hooks/useNavRegistry'
import './tailwind.css'

// ── Free pages (always loaded) ──────────────────────────
const ProjectsPage    = React.lazy(() => import('@components/projects/ProjectsPage'))
const SettingsPage    = React.lazy(() => import('@components/admin-settings/SettingsPage'))
const TaskListsPage   = React.lazy(() => import('@components/tasks/TaskListsPage'))
const ProjectOverview = React.lazy(() => import('@components/projects/ProjectOverview'))
const DiscussionsPage = React.lazy(() => import('@components/projects/DiscussionsPage'))
const MilestonesPage  = React.lazy(() => import('@components/projects/MilestonesPage'))
const FilesPage       = React.lazy(() => import('@components/projects/FilesPage'))
const ActivitiesPage  = React.lazy(() => import('@components/projects/ActivitiesPage'))
const CategoriesPage  = React.lazy(() => import('@components/projects/CategoriesPage'))
const PremiumPage     = React.lazy(() => import('@components/projects/PremiumPage'))
const ModulesPage     = React.lazy(() => import('@components/projects/ModulesPage'))
const MyTasksPage     = React.lazy(() => import('@components/my-tasks/MyTasksPage'))
const ToolsPage       = React.lazy(() => import('@components/projects/ToolsPage'))

// ── Free placeholder pages (shown when Pro does NOT replace them) ──
const CalendarPlaceholder = React.lazy(() => import('@components/projects/CalendarPage'))
const ReportsPlaceholder  = React.lazy(() => import('@components/projects/ReportsPage'))
const ProgressPlaceholder = React.lazy(() => import('@components/projects/ProgressPage'))

// ── Replaceable page wrapper — pro can override via filters ──
function FilteredPage({ filterName, fallback: Fallback }) {
  const Override = useFilter(filterName, null)
  if (Override) {
    return <React.Suspense fallback={null}>{Override}</React.Suspense>
  }
  return <Fallback />
}

function AppRoutes() {
  const dynamicRoutes = useRegisteredRoutes()

  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* ── Free routes ── */}
        <Route index element={<Navigate to="/projects" replace />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId/task-lists" element={<TaskListsPage />} />
        <Route path="projects/:projectId/overview" element={<ProjectOverview />} />
        <Route path="projects/:projectId/discussions" element={<DiscussionsPage />} />
        <Route path="projects/:projectId/milestones" element={<MilestonesPage />} />
        <Route path="projects/:projectId/files" element={<FilesPage />} />
        <Route path="projects/:projectId/activities" element={<ActivitiesPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="premium" element={<PremiumPage />} />
        <Route path="my-tasks" element={<MyTasksPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="importtools" element={<ToolsPage />} />

        {/* ── Replaceable pages — Pro overrides via registerFilter() ── */}
        <Route path="calendar" element={<FilteredPage filterName="route.calendar.element" fallback={CalendarPlaceholder} />} />
        <Route path="reports/*" element={<FilteredPage filterName="route.reports.element" fallback={ReportsPlaceholder} />} />
        <Route path="modules" element={<FilteredPage filterName="route.modules.element" fallback={ModulesPage} />} />
        <Route path="progress" element={<FilteredPage filterName="route.progress.element" fallback={ProgressPlaceholder} />} />

        {/* ── Dynamic routes registered by Pro plugin ── */}
        {dynamicRoutes.map(({ path, element }, i) => (
          <Route key={`pro-${i}`} path={path} element={
            <React.Suspense fallback={null}>{element}</React.Suspense>
          } />
        ))}

        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <ProModalProvider>
        <div id="wedevs-project-manager">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <span className="w-5 h-5 rounded-full border-2 border-pm-accent border-t-transparent animate-spin" />
              </div>
            }
          >
            <AppRoutes />
          </React.Suspense>
        </div>
        </ProModalProvider>
        {createPortal(
          <Toaster position="bottom-center" toastOptions={{ style: { zIndex: 99999 } }} style={{ zIndex: 99999 }} />,
          document.body
        )}
      </HashRouter>
    </Provider>
  )
}

// ── Expose PM extension APIs for Pro plugin ──────────────
window.PM = {
  // Extension system (React-reactive + WP hooks bridge)
  registerSlot,
  registerFilter,
  applyFilters,
  doAction,
  addAction,
  Slot,
  useFilter,
  useSlotFills,
  injectReducer,
  registerRoute,
  useRegisteredRoutes,
  registerNavItem,
  useRegisteredNavItems,
  store,

  // Free store thunks that pro may need to dispatch
  thunks: { fetchTask },

  // Re-export libraries so Pro uses the SAME instances (no duplicate bundling)
  libs: {
    React,
    ReactDOM: require('react-dom'),
    ReactRedux,
    ReactRouterDom,
    ReduxToolkit,
  },

  // Re-export shadcn/ui components so pro doesn't need its own copies
  ui: {
    Avatar:       require('@components/ui/avatar'),
    Badge:        require('@components/ui/badge'),
    Button:       require('@components/ui/button'),
    Card:         require('@components/ui/card'),
    Checkbox:     require('@components/ui/checkbox'),
    Command:      require('@components/ui/command'),
    ContextMenu:  require('@components/ui/context-menu'),
    Dialog:       require('@components/ui/dialog'),
    DropdownMenu: require('@components/ui/dropdown-menu'),
    Input:        require('@components/ui/input'),
    Label:        require('@components/ui/label'),
    Pagination:   require('@components/ui/pagination'),
    Popover:      require('@components/ui/popover'),
    Progress:     require('@components/ui/progress'),
    RadioGroup:   require('@components/ui/radio-group'),
    ScrollArea:   require('@components/ui/scroll-area'),
    Select:       require('@components/ui/select'),
    Separator:    require('@components/ui/separator'),
    Sheet:        require('@components/ui/sheet'),
    Skeleton:     require('@components/ui/skeleton'),
    Switch:       require('@components/ui/switch'),
    Table:        require('@components/ui/table'),
    Tabs:         require('@components/ui/tabs'),
    Textarea:     require('@components/ui/textarea'),
    Tooltip:      require('@components/ui/tooltip'),
  },

  // Re-export Radix UI primitives so pro uses the SAME context instances.
  // Without this, pro bundles its own Radix and DismissableLayer/FocusScope
  // contexts conflict with free's Sheet — clicks inside pro popovers get eaten.
  radix: {
    Dialog:      require('@radix-ui/react-dialog'),
    Popover:     require('@radix-ui/react-popover'),
    DropdownMenu: require('@radix-ui/react-dropdown-menu'),
    Select:      require('@radix-ui/react-select'),
    Checkbox:    require('@radix-ui/react-checkbox'),
    Switch:      require('@radix-ui/react-switch'),
    RadioGroup:  require('@radix-ui/react-radio-group'),
    Tabs:        require('@radix-ui/react-tabs'),
    Tooltip:     require('@radix-ui/react-tooltip'),
    Avatar:      require('@radix-ui/react-avatar'),
    Label:       require('@radix-ui/react-label'),
    Separator:   require('@radix-ui/react-separator'),
    ScrollArea:  require('@radix-ui/react-scroll-area'),
    Progress:    require('@radix-ui/react-progress'),
    Slot:        require('@radix-ui/react-slot'),
    ContextMenu: require('@radix-ui/react-context-menu'),
  },
}

// Mount immediately — no deferred mount needed.
const mountId = (typeof PM_Vars !== 'undefined' && PM_Vars.id) ? PM_Vars.id : 'wedevs-pm'
const el = document.getElementById(mountId)

if (el) {
  const root = createRoot(el)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
