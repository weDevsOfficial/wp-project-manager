import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useProApi } from '@hooks/useProApi'

const api = useProApi()

const initialState = {
  sprints: [],
  currentSprint: null,
  sprintTasks: [],
  pagination: null,
  loading: false,
  saving: false,
}

export const fetchSprints = createAsyncThunk(
  'sprint/fetchSprints',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('sprints', { with: 'projects,incomplete_tasks,complete_tasks', ...params })
      return res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const createSprint = createAsyncThunk(
  'sprint/createSprint',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('sprints', payload)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const updateSprint = createAsyncThunk(
  'sprint/updateSprint',
  async ({ sprintId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`sprints/${sprintId}/update`, payload)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const updateSprintStatus = createAsyncThunk(
  'sprint/updateSprintStatus',
  async ({ sprintId, status }, { rejectWithValue }) => {
    try {
      const res = await api.post(`sprints/${sprintId}/update-status`, { status })
      return { sprintId, status, data: res.data ?? res }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const deleteSprint = createAsyncThunk(
  'sprint/deleteSprint',
  async ({ sprintId }, { rejectWithValue }) => {
    try {
      await api.post(`sprints/${sprintId}/delete`)
      return sprintId
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const fetchSprintTasks = createAsyncThunk(
  'sprint/fetchSprintTasks',
  async ({ sprintId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`sprints/${sprintId}/tasks`)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const addTaskToSprint = createAsyncThunk(
  'sprint/addTaskToSprint',
  async ({ sprintId, taskId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`sprints/${sprintId}/add-task`, { task_id: taskId })
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const removeTaskFromSprint = createAsyncThunk(
  'sprint/removeTaskFromSprint',
  async ({ sprintId, taskId }, { rejectWithValue }) => {
    try {
      await api.post(`sprints/${sprintId}/tasks/${taskId}/delete`)
      return { sprintId, taskId }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const moveTaskBetweenSprints = createAsyncThunk(
  'sprint/moveTask',
  async ({ sprintId, taskId, targetSprintId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`sprints/${sprintId}/tasks/${taskId}/move`, { target_sprint_id: targetSprintId })
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const sprintSlice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setCurrentSprint(state, action) { state.currentSprint = action.payload },
    resetSprints() { return initialState },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSprints.pending, (state) => { state.loading = true })
      .addCase(fetchSprints.fulfilled, (state, action) => {
        state.loading = false
        state.sprints = action.payload?.data ?? []
        state.pagination = action.payload?.meta ?? null
      })
      .addCase(fetchSprints.rejected, (state) => { state.loading = false })
      .addCase(createSprint.fulfilled, (state, action) => {
        state.sprints.unshift(action.payload)
      })
      .addCase(deleteSprint.fulfilled, (state, action) => {
        state.sprints = state.sprints.filter(s => s.id !== action.payload)
      })
      .addCase(updateSprintStatus.fulfilled, (state, action) => {
        const sprint = state.sprints.find(s => s.id === action.payload.sprintId)
        if (sprint) sprint.status = action.payload.status
      })
      .addCase(fetchSprintTasks.fulfilled, (state, action) => {
        state.sprintTasks = Array.isArray(action.payload) ? action.payload : []
      })
  },
})

export const { setCurrentSprint, resetSprints } = sprintSlice.actions
export default sprintSlice.reducer
