import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useApi } from '@hooks/useApi'
import { resetProjectState } from './actions'

const api = useApi()

// ── State ─────────────────────────────────────────────

const initialState = {
  currentTask:    null,
  taskSheetOpen:  false,
  taskComments:   [],
  loading:        false,
  saving:         false,
}

// ── Async thunks ──────────────────────────────────────

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      // Vue uses: with: 'boards,comments,activities,project'
      // Pro transformer auto-adds: labels, time, custom_fields
      const res = await api.get(
        `projects/${projectId}/tasks/${taskId}`,
        { with: 'assignees,comments,labels,activities,project' },
      )
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to load task')
    }
  },
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (
    { projectId, payload },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post(
        `projects/${projectId}/tasks`,
        { ...payload, project_id: projectId },
      )
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to create task')
    }
  },
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    { projectId, taskId, data },
    { getState, rejectWithValue },
  ) => {
    try {
      // API validator requires title + project_id on every update
      const state = getState().tasks
      const current = state.currentTask
      const payload = {
        project_id: projectId,
        title: current?.title ?? '',
        ...data,
      }
      const res = await api.post(
        `projects/${projectId}/tasks/${taskId}/update`,
        payload,
      )
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to update task')
    }
  },
)

export const changeTaskStatus = createAsyncThunk(
  'tasks/changeTaskStatus',
  async (
    { projectId, taskId, status },
    { rejectWithValue },
  ) => {
    try {
      await api.post(`projects/${projectId}/tasks/${taskId}/change-status`, { status })
      return { taskId, status }
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to change task status')
    }
  },
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (
    { projectId, taskId },
    { rejectWithValue },
  ) => {
    try {
      await api.post(`projects/${projectId}/tasks/${taskId}/delete`)
      return taskId
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to delete task')
    }
  },
)

export const duplicateTask = createAsyncThunk(
  'tasks/duplicateTask',
  async (taskId, { rejectWithValue }) => {
    try {
      // duplicate endpoint uses wp_send_json_success → { success: true, data: { task, list_id, project_id } }
      const res = await api.post(`tasks/${taskId}/duplicate`)
      const task = res.data?.task
      const listId = res.data?.list_id
      return { task, listId }
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to duplicate task')
    }
  },
)

export const sortTasks = createAsyncThunk(
  'tasks/sortTasks',
  async (
    { projectId, listId, taskId, orders, receive },
    { rejectWithValue },
  ) => {
    try {
      await api.post(`projects/${projectId}/tasks/sorting`, {
        project_id: projectId,
        list_id: listId,
        task_id: taskId,
        orders,
        receive,
      })
      return { listId, taskId, orders, receive }
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to sort tasks')
    }
  },
)

export const addTaskComment = createAsyncThunk(
  'tasks/addTaskComment',
  async (
    { projectId, taskId, content },
    { rejectWithValue },
  ) => {
    try {
      // Comment endpoint is projects/{pid}/comments (NOT tasks/{tid}/comments)
      // Requires: content, commentable_id, commentable_type, project_id
      const res = await api.post(
        `projects/${projectId}/comments`,
        {
          content,
          commentable_id: taskId,
          commentable_type: 'task',
          mentioned_users: '',
          notify_users: '',
          project_id: projectId,
        },
      )
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to add comment')
    }
  },
)

// ── Slice ─────────────────────────────────────────────

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    openTaskSheet(state, action) {
      state.currentTask = action.payload
      state.taskSheetOpen = true
    },
    closeTaskSheet(state) {
      state.taskSheetOpen = false
      state.currentTask = null
      state.taskComments = []
    },
    setCurrentTask(state, action) {
      state.currentTask = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTask.pending, (state) => { state.loading = true })
    builder.addCase(fetchTask.fulfilled, (state, action) => {
      state.loading = false
      state.currentTask = action.payload
      state.taskComments = action.payload?.comments?.data ?? []
    })
    builder.addCase(fetchTask.rejected, (state) => { state.loading = false })

    builder.addCase(createTask.pending, (state) => { state.saving = true })
    builder.addCase(createTask.fulfilled, (state) => { state.saving = false })
    builder.addCase(createTask.rejected, (state) => { state.saving = false })

    builder.addCase(updateTask.pending, (state) => { state.saving = true })
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.saving = false
      if (action.payload && state.currentTask?.id === action.payload.id) {
        state.currentTask = { ...state.currentTask, ...action.payload }
      }
    })
    builder.addCase(updateTask.rejected, (state) => { state.saving = false })

    builder.addCase(changeTaskStatus.fulfilled, (state, action) => {
      if (state.currentTask?.id === action.payload.taskId) {
        state.currentTask = { ...state.currentTask, status: action.payload.status }
      }
    })

    builder.addCase(addTaskComment.fulfilled, (state, action) => {
      if (action.payload) {
        state.taskComments.push(action.payload)
      }
    })

    // Global project reset — clear task sheet and comments
    builder.addCase(resetProjectState, () => initialState)
  },
})

export const { openTaskSheet, closeTaskSheet, setCurrentTask } = tasksSlice.actions
export default tasksSlice.reducer
