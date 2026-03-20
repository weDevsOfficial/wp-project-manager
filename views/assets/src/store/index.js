import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import settingsReducer from './settingsSlice'
import projectsReducer from './projectsSlice'
import taskListsReducer from './taskListsSlice'
import tasksReducer from './tasksSlice'

// Static (free) reducers — always present
const staticReducers = {
  settings:  settingsReducer,
  projects:  projectsReducer,
  taskLists: taskListsReducer,
  tasks:     tasksReducer,
}

// Dynamic reducers — pro plugin injects its slices at runtime
const asyncReducers = {}

function createRootReducer() {
  return combineReducers({ ...staticReducers, ...asyncReducers })
}

export const store = configureStore({
  reducer: createRootReducer(),
})

/**
 * Inject a reducer at runtime. Called by pro plugin to add its slices
 * (kanban, gantt, sprint, invoice, etc.) without bundling them in free.
 */
export function injectReducer(key, reducer) {
  if (asyncReducers[key]) return // already injected
  asyncReducers[key] = reducer
  store.replaceReducer(createRootReducer())
}

export const useAppDispatch = useDispatch
export const useAppSelector = useSelector
