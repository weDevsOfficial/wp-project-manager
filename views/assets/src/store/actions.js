import { createAction } from '@reduxjs/toolkit'

/**
 * Global action dispatched when navigating between projects.
 * ALL project-scoped slices (free + pro) must listen for this in extraReducers
 * and reset their state to initialState to prevent cross-project data leaks.
 */
export const resetProjectState = createAction('global/resetProjectState')
