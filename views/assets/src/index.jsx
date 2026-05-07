import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import { Provider } from 'react-redux'
import * as ReactRedux from 'react-redux'
import * as ReactRouterDom from 'react-router-dom'
import * as ReduxToolkit from '@reduxjs/toolkit'
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import * as SonnerLib from 'sonner'
const { Toaster } = SonnerLib
import { store, injectReducer, resetProjectState } from '@store/index'
import { fetchTask, openTaskSheet, closeTaskSheet, markTaskModified } from '@store/tasksSlice'
import { fetchTaskLists } from '@store/taskListsSlice'
import { fetchProjectAssignees } from '@store/projectsSlice'
import { useProjectAssignees } from '@hooks/useProjectAssignees'
import TaskDetailSheet from '@components/tasks/TaskDetailSheet'
import TaskLabelBadges from '@components/tasks/TaskLabelBadges'
import { AppLayout } from '@components/layout/AppLayout'
import { FrontendLayout } from '@components/layout/FrontendLayout'
import { ProModalProvider } from '@components/common/ProUpgradeModal'
import { UserAvatar } from '@components/common/UserAvatar'
import { registerSlot, registerFilter, applyFilters, doAction, addAction, Slot, useFilter, useSlotFills } from '@hooks/useSlot'
import { registerRoute, useRegisteredRoutes } from '@/router/routeRegistry'
import { registerNavItem, useRegisteredNavItems } from '@hooks/useNavRegistry'
import { sanitizeHtml } from '@lib/sanitize'
import './tailwind.css'

// ── Free pages (always loaded) ──────────────────────────
const ProjectsPage    = React.lazy(() => import('@components/projects/ProjectsPage'))
const SettingsPage    = React.lazy(() => import('@components/admin-settings/SettingsPage'))
const TaskListsPage   = React.lazy(() => import('@components/tasks/TaskListsPage'))
const SingleTaskListPage = React.lazy(() => import('@components/tasks/SingleTaskListPage'))
const ProjectOverview = React.lazy(() => import('@components/projects/ProjectOverview'))
const DiscussionsPage = React.lazy(() => import('@components/projects/DiscussionsPage'))
const DiscussionDetailPage = React.lazy(() => import('@components/projects/DiscussionsPage/DiscussionDetailPage'))
const MilestonesPage  = React.lazy(() => import('@components/projects/MilestonesPage'))
const FilesPage       = React.lazy(() => import('@components/projects/FilesPage'))
const ActivitiesPage  = React.lazy(() => import('@components/projects/ActivitiesPage'))
const CategoriesPage  = React.lazy(() => import('@components/projects/CategoriesPage'))
const PremiumPage     = React.lazy(() => import('@components/projects/PremiumPage'))
const ModulesPage     = React.lazy(() => import('@components/projects/ModulesPage'))
const MyTasksPage     = React.lazy(() => import('@components/my-tasks/MyTasksPage'))
const ToolsPage       = React.lazy(() => import('@components/projects/ToolsPage'))
const WelcomePage     = React.lazy(() => import('@components/welcome/WelcomePage'))
const LicensePage     = React.lazy(() => import('@components/projects/LicensePage'))

// ── Free placeholder pages (shown when Pro does NOT replace them) ──
const CalendarPlaceholder = React.lazy(() => import('@components/projects/CalendarPage'))
const ReportsPlaceholder  = React.lazy(() => import('@components/projects/ReportsPage'))
const ProgressPlaceholder = React.lazy(() => import('@components/projects/ProgressPage'))
import ProFeaturePlaceholder from '@components/common/ProFeaturePlaceholder'
import { AdminRoute, ProjectRoute, LicenseRoute, ManagerRoute } from '@components/common/ProtectedRoute'
import { ErrorBoundary } from '@components/common/ErrorBoundary'
import { Columns3, GitBranch, Receipt, Settings as SettingsIcon, Zap, ShoppingCart } from 'lucide-react'

// ── Replaceable page wrapper — pro can override via filters ──
function FilteredPage({ filterName, fallback: Fallback }) {
  const Override = useFilter(filterName, null)
  if (Override) {
    return <React.Suspense fallback={null}>{Override}</React.Suspense>
  }
  // Pro installed but not yet signaled ready — render nothing to avoid flash of free placeholder
  if (typeof PM_Pro_Vars !== 'undefined' && !window.PM?._proReady) {
    return null
  }
  return <Fallback />
}

function TaskDeepLinkOpener() {
  const { projectId, taskId } = useParams()
  useEffect(() => {
    const state = store.getState()
    if (state.tasks?.taskSheetOpen && String(state.tasks?.currentTask?.id) === String(taskId)) return
    store.dispatch(fetchTask({ projectId, taskId })).then((action) => {
      const task = action.payload
      if (task) store.dispatch(openTaskSheet(task))
    })
  }, [projectId, taskId])
  return null
}

function AppRoutes() {
  const dynamicRoutes = useRegisteredRoutes()
  const isFrontend = typeof PM_Vars !== 'undefined' && PM_Vars.is_frontend && !PM_Vars.is_admin
  const isProInstalled = typeof PM_Pro_Vars !== 'undefined'
  const Layout = isFrontend ? FrontendLayout : AppLayout

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ── Free routes ── */}
        <Route index element={<Navigate to="/projects" replace />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId/task-lists" element={<ProjectRoute><TaskListsPage /></ProjectRoute>} />
        <Route path="projects/:projectId/task-lists/tasks/:taskId" element={<ProjectRoute><TaskListsPage /><TaskDeepLinkOpener /></ProjectRoute>} />
        <Route path="projects/:projectId/task-lists/:listId" element={<ProjectRoute><SingleTaskListPage /></ProjectRoute>} />
        <Route path="projects/:projectId/task-lists/:listId/tasks/:taskId" element={<ProjectRoute><SingleTaskListPage /><TaskDeepLinkOpener /></ProjectRoute>} />
        <Route path="projects/:projectId/overview" element={<ProjectRoute><ProjectOverview /></ProjectRoute>} />
        <Route path="projects/:projectId/discussions" element={<ProjectRoute><DiscussionsPage /></ProjectRoute>} />
        <Route path="projects/:projectId/discussions/:discussionId" element={<ProjectRoute><DiscussionDetailPage /></ProjectRoute>} />
        <Route path="projects/:projectId/milestones" element={<ProjectRoute><MilestonesPage /></ProjectRoute>} />
        <Route path="projects/:projectId/milestones/tasks/:taskId" element={<ProjectRoute><MilestonesPage /><TaskDeepLinkOpener /></ProjectRoute>} />
        <Route path="projects/:projectId/files" element={<ProjectRoute><FilteredPage filterName="route.files.element" fallback={FilesPage} /></ProjectRoute>} />
        <Route path="projects/:projectId/activities" element={<ProjectRoute><ActivitiesPage /></ProjectRoute>} />
        <Route path="my-tasks" element={<MyTasksPage />} />

        {/* ── Admin-only routes — gated by AdminRoute. Categories also available on frontend for admins. ── */}
        <Route path="categories" element={<AdminRoute><CategoriesPage /></AdminRoute>} />
        {/* settings/tools/welcome/modules stay wp-admin-only */}
        {!isFrontend && <Route path="settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />}
        {!isFrontend && <Route path="importtools" element={<AdminRoute><ToolsPage /></AdminRoute>} />}
        {!isFrontend && <Route path="welcome" element={<AdminRoute><WelcomePage /></AdminRoute>} />}
        {!isFrontend && <Route path="modules" element={<AdminRoute><FilteredPage filterName="route.modules.element" fallback={ModulesPage} /></AdminRoute>} />}
        <Route path="premium" element={<AdminRoute><PremiumPage /></AdminRoute>} />
        {!isFrontend && isProInstalled && <Route path="license" element={<LicenseRoute><LicensePage /></LicenseRoute>} />}

        {/* ── Replaceable pages — Pro overrides via registerFilter() ── */}
        <Route path="calendar" element={<FilteredPage filterName="route.calendar.element" fallback={CalendarPlaceholder} />} />
        <Route path="reports/*" element={<FilteredPage filterName="route.reports.element" fallback={ReportsPlaceholder} />} />
        <Route path="progress" element={<FilteredPage filterName="route.progress.element" fallback={ProgressPlaceholder} />} />

        {/* ── Dynamic routes registered by Pro plugin ── */}
        {dynamicRoutes.map(({ path, element }, i) => (
          <Route key={`pro-${i}`} path={path} element={
            <React.Suspense fallback={null}>{element}</React.Suspense>
          } />
        ))}

        {/* ── Pro feature placeholders — only shown when Pro hasn't registered the route ── */}
        {!dynamicRoutes.some(r => r.path === 'projects/:projectId/kanban') && (
          <Route path="projects/:projectId/kanban" element={<ProjectRoute><ProFeaturePlaceholder title="Kanban Board" description="Visualize your workflow with drag-and-drop boards." icon={Columns3} mockKey="kanban" /></ProjectRoute>} />
        )}
        {!dynamicRoutes.some(r => r.path === 'projects/:projectId/gantt') && (
          <Route path="projects/:projectId/gantt" element={<ProjectRoute><ProFeaturePlaceholder title="Gantt Chart" description="Plan and track project timelines with interactive Gantt charts." icon={GitBranch} mockKey="gantt" /></ProjectRoute>} />
        )}
        {!dynamicRoutes.some(r => r.path === 'projects/:projectId/invoices') && (
          <Route path="projects/:projectId/invoices" element={<ProjectRoute managerOnly><ProFeaturePlaceholder title="Invoices" description="Create and manage project invoices with payment tracking." icon={Receipt} mockKey="invoices" /></ProjectRoute>} />
        )}
        {!dynamicRoutes.some(r => r.path === 'projects/:projectId/settings') && (
          <Route path="projects/:projectId/settings" element={<ProjectRoute managerOnly><ProFeaturePlaceholder title="Project Settings" description="Configure project capabilities, integrations, and more." icon={SettingsIcon} mockKey="settings" /></ProjectRoute>} />
        )}
        {!dynamicRoutes.some(r => r.path === 'sprints') && (
          <Route path="sprints" element={<ProFeaturePlaceholder title="Sprints" description="Plan and manage agile sprints to organize your team's work into focused iterations." icon={Zap} mockKey="sprints" />} />
        )}
        {!dynamicRoutes.some(r => r.path === 'woo-project') && (
          <Route path="woo-project" element={<ProFeaturePlaceholder title="WooCommerce Project" description="Automatically create projects from WooCommerce orders with product-based templates." icon={ShoppingCart} mockKey="woo-project" />} />
        )}

        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  useEffect(() => {
    const stripInlineColor = (html) => String(html).replace(/style="[^"]*"/gi, '')
    const handler = (e) => {
      const { title, message } = e.detail || {}
      if (!title && !message) return
      const titleNode = title
        ? <span className="pm-pusher-toast" dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripInlineColor(title)) }} />
        : null
      const descNode = message
        ? <span className="pm-pusher-toast" dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripInlineColor(message)) }} />
        : null
      SonnerLib.toast(titleNode || descNode, {
        description: titleNode && descNode ? descNode : undefined,
      })
    }
    window.addEventListener('pm:pusher-notification', handler)
    return () => window.removeEventListener('pm:pusher-notification', handler)
  }, [])

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
          <Toaster position="bottom-center" richColors toastOptions={{ style: { zIndex: 99999 } }} style={{ zIndex: 99999 }} />,
          document.body
        )}
      </HashRouter>
    </Provider>
  )
}

// ── Dark mode toggle API (exposed before mount so Pro can call it) ──
function setDarkMode(force) {
  const isDark = typeof force === 'boolean' ? force : document.documentElement.getAttribute('data-pm-theme') !== 'dark'
  document.documentElement.setAttribute('data-pm-theme', isDark ? 'dark' : 'light')
  const mountEl = document.getElementById(mountId)
  if (mountEl) mountEl.classList.toggle('dark', isDark)
  localStorage.setItem('pm-dark-mode', String(isDark))
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
  setDarkMode,

  // Free store actions/thunks that pro may need to dispatch
  thunks: { fetchTask, fetchTaskLists, fetchProjectAssignees },
  actions: { resetProjectState, openTaskSheet, closeTaskSheet, markTaskModified },

  // Free hooks that pro may use (same Redux store context)
  hooks: { useProjectAssignees },

  // Components that pro needs to use (exposed for cross-plugin integration)
  components: {
    UserAvatar,
    TaskLabelBadges,
    ErrorBoundary,
    AdminRoute,
    ProjectRoute,
    LicenseRoute,
    ManagerRoute,
    BackButton:       require('@components/common/BackButton'),
    FileUploadArea:  require('@components/common/FileUploadArea'),
    ProBadge:        require('@components/common/ProBadge'),
    ProUpgradeModal: require('@components/common/ProUpgradeModal'),
    LicenseGuard:    require('@components/common/LicenseGuard'),
    NewTaskSheet:    require('@components/my-tasks/MyTasksPage/parts/NewTaskSheet'),
    TaskDetailSheet: (() => {
      // Wrap component to ensure proper error handling across plugin boundaries
      const WrappedTaskDetailSheet = (props) => {
        try {
          return <TaskDetailSheet {...props} />
        } catch (error) {
          console.error('[PM] TaskDetailSheet error:', error)
          return null
        }
      }
      WrappedTaskDetailSheet.displayName = 'TaskDetailSheet'
      return WrappedTaskDetailSheet
    })()
  },

  // Re-export libraries so Pro uses the SAME instances (no duplicate bundling)
  libs: {
    React,
    ReactDOM: require('react-dom'),
    ReactJsxRuntime: require('react/jsx-runtime'),
    ReactRedux,
    ReactRouterDom,
    ReduxToolkit,
    Sonner: SonnerLib,
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
    AlertDialog:  require('@components/ui/alert-dialog'),
    ColorPicker:  require('@components/ui/color-picker'),
    RichTextEditor:         require('@components/common/RichTextEditor'),
    GitHubPreviewContainer: require('@components/common/GitHubPreviewContainer'),
    NotionPreviewContainer: require('@components/common/NotionPreviewContainer'),
    LoomPreviewContainer:   require('@components/common/LoomPreviewContainer'),
  },

  // Shared utilities for pro plugin
  utils: {
    urlStrippers: require('@/lib/url-strippers'),
    sanitize: require('@lib/sanitize'),
    pmUtils: require('@lib/pm-utils'),
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
  // ── Dark mode detection ──────────────────────────────────────────────────
  // Priority: WP admin color scheme → system prefers-color-scheme.
  // WP sets data-js="color-scheme-dark" on <html> when user picks a dark scheme.
  // data-pm-theme set on <html> so :root vars apply globally (covers Radix portals).
  // .dark class set on mount el so Tailwind dark: utilities work inside the app.
  function applyDarkMode() {
    const stored = localStorage.getItem('pm-dark-mode')
    const isDark = stored === 'true'
    document.documentElement.setAttribute('data-pm-theme', isDark ? 'dark' : 'light')
    el.classList.toggle('dark', isDark)
  }

  applyDarkMode()

  const root = createRoot(el)
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
}
