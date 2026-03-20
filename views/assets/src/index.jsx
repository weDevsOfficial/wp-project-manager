import React from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { store } from '@store/index'
import { AppLayout } from '@components/layout/AppLayout'
import { ProModalProvider } from '@components/common/ProUpgradeModal'
import './tailwind.css'

const isPro = typeof PM_Vars !== 'undefined' && !!PM_Vars.is_pro

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

// ── Free placeholder pages (shown when Pro is NOT active) ──
const CalendarPlaceholder = React.lazy(() => import('@components/projects/CalendarPage'))
const ReportsPlaceholder  = React.lazy(() => import('@components/projects/ReportsPage'))

// ── Pro pages (lazy-loaded, ONLY downloaded when isPro && route matched) ──
const KanbanBoard     = isPro ? React.lazy(() => import('@components/pro/KanbanBoard'))       : null
const GanttChart      = isPro ? React.lazy(() => import('@components/pro/GanttChart'))        : null
const SprintPage      = isPro ? React.lazy(() => import('@components/pro/SprintPage'))        : null
const InvoicePage     = isPro ? React.lazy(() => import('@components/pro/InvoicePage'))       : null
const ProReportsPage  = isPro ? React.lazy(() => import('@components/pro/ProReportsPage'))    : null
const ProCalendarPage = isPro ? React.lazy(() => import('@components/pro/ProCalendarPage'))   : null
const ProModulesPage  = isPro ? React.lazy(() => import('@components/pro/ProModulesPage'))    : null
const LicensePage     = isPro ? React.lazy(() => import('@components/pro/LicensePage'))       : null
const ProjectSettingsPage = isPro ? React.lazy(() => import('@components/pro/project-settings/ProjectSettingsPage')) : null

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

                {/* ── Calendar & Reports — Pro replaces free placeholder ── */}
                <Route path="calendar" element={ProCalendarPage ? <ProCalendarPage /> : <CalendarPlaceholder />} />
                <Route path="reports/*" element={ProReportsPage ? <ProReportsPage /> : <ReportsPlaceholder />} />
                <Route path="modules" element={ProModulesPage ? <ProModulesPage /> : <ModulesPage />} />

                {/* ── Pro-only routes (never rendered for free users) ── */}
                {KanbanBoard && <Route path="projects/:projectId/kanban" element={<KanbanBoard />} />}
                {GanttChart && <Route path="projects/:projectId/gantt" element={<GanttChart />} />}
                {InvoicePage && <Route path="projects/:projectId/invoices" element={<InvoicePage />} />}
                {SprintPage && <Route path="sprints" element={<SprintPage />} />}
                {LicensePage && <Route path="license" element={<LicensePage />} />}
                {ProjectSettingsPage && <Route path="projects/:projectId/settings" element={<ProjectSettingsPage />} />}

                <Route path="*" element={<Navigate to="/projects" replace />} />
              </Route>
            </Routes>
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
