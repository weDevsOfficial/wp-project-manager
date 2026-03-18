import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { store } from '@store/index'
import { AppLayout } from '@components/layout/AppLayout'
import { ProModalProvider } from '@components/common/ProUpgradeModal'
import './tailwind.css'

// Lazy-load page components
const ProjectsPage    = React.lazy(() => import('@components/projects/ProjectsPage'))
const SettingsPage    = React.lazy(() => import('@components/admin-settings/SettingsPage'))
const TaskListsPage     = React.lazy(() => import('@components/tasks/TaskListsPage'))
const ProjectOverview   = React.lazy(() => import('@components/projects/ProjectOverview'))
const DiscussionsPage   = React.lazy(() => import('@components/projects/DiscussionsPage'))
const MilestonesPage    = React.lazy(() => import('@components/projects/MilestonesPage'))
const FilesPage         = React.lazy(() => import('@components/projects/FilesPage'))
const ActivitiesPage    = React.lazy(() => import('@components/projects/ActivitiesPage'))
const CategoriesPage    = React.lazy(() => import('@components/projects/CategoriesPage'))
const PremiumPage       = React.lazy(() => import('@components/projects/PremiumPage'))
const ModulesPage       = React.lazy(() => import('@components/projects/ModulesPage'))

const MyTasksPage     = React.lazy(() => import('@components/my-tasks/MyTasksPage'))

// Placeholder pages (Phase 2)
const CalendarPage    = React.lazy(() => import('@components/projects/CalendarPage'))
const ReportsPage     = React.lazy(() => import('@components/projects/ReportsPage'))

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
                <Route path="modules" element={<ModulesPage />} />
                <Route path="my-tasks" element={<MyTasksPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/projects" replace />} />
              </Route>
            </Routes>
          </React.Suspense>
          <Toaster position="bottom-center" />
        </div>
        </ProModalProvider>
      </HashRouter>
    </Provider>
  )
}

// Mount
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
