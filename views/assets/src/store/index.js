import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import settingsReducer from './settingsSlice'
import projectsReducer from './projectsSlice'
import taskListsReducer from './taskListsSlice'
import tasksReducer from './tasksSlice'

// Pro slices — conditionally imported but only registered when PM Pro is active.
// These are lazy-loaded by webpack code-splitting. Free users never download this code.
import kanbanReducer from './pro/kanbanSlice'
import sprintReducer from './pro/sprintSlice'
import timeTrackerReducer from './pro/timeTrackerSlice'
import invoiceReducer from './pro/invoiceSlice'
import subtasksReducer from './pro/subtasksSlice'
import customFieldsReducer from './pro/customFieldsSlice'
import ganttReducer from './pro/ganttSlice'
import labelsReducer from './pro/labelsSlice'
import reportsReducer from './pro/reportsSlice'
import calendarReducer from './pro/calendarSlice'
import modulesReducer from './pro/modulesSlice'
import licenseReducer from './pro/licenseSlice'

const isPro = typeof PM_Vars !== 'undefined' && !!PM_Vars.is_pro

// Pro reducers only added when PM Pro plugin is active.
// The slices themselves are tiny (empty initial state) so the import cost is negligible.
// The real savings come from lazy-loading Pro page COMPONENTS (not slices).
const proReducers = isPro ? {
  kanban:       kanbanReducer,
  sprint:       sprintReducer,
  timeTracker:  timeTrackerReducer,
  invoice:      invoiceReducer,
  subtasks:     subtasksReducer,
  customFields: customFieldsReducer,
  gantt:        ganttReducer,
  labels:       labelsReducer,
  reports:      reportsReducer,
  calendar:     calendarReducer,
  modules:      modulesReducer,
  license:      licenseReducer,
} : {}

export const store = configureStore({
  reducer: {
    settings:  settingsReducer,
    projects:  projectsReducer,
    taskLists: taskListsReducer,
    tasks:     tasksReducer,
    ...proReducers,
  },
})

export const useAppDispatch = useDispatch
export const useAppSelector = useSelector
