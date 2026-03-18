import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import settingsReducer from './settingsSlice'
import projectsReducer from './projectsSlice'
import taskListsReducer from './taskListsSlice'
import tasksReducer from './tasksSlice'

export const store = configureStore({
  reducer: {
    settings:  settingsReducer,
    projects:  projectsReducer,
    taskLists: taskListsReducer,
    tasks:     tasksReducer,
  },
})

export const useAppDispatch = useDispatch
export const useAppSelector = useSelector
