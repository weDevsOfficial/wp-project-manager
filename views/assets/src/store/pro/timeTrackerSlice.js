import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useProApi } from '@hooks/useProApi'

const api = useProApi()

const initialState = {
  timeLogs: [],
  runningTimer: null,     // { id, task_id, project_id, start }
  othersLogs: [],
  reportSummary: null,
  loading: false,
}

// Vue sends: project_id, list_id, task_id, hour, minute, second, start: true, title: ''
export const startTimer = createAsyncThunk(
  'timeTracker/startTimer',
  async ({ projectId, taskId, listId }, { rejectWithValue }) => {
    try {
      const res = await api.post('time', {
        project_id: projectId,
        task_id: taskId,
        list_id: listId || '',
        start: true,
        hour: '00',
        minute: '00',
        second: '00',
        title: '',
      })
      // Ensure task_id is on the returned object for isRunning check
      const data = res.data ?? res
      if (data && !data.task_id) data.task_id = taskId
      return data
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Vue sends: project_id, list_id, task_id to stop
export const stopTimer = createAsyncThunk(
  'timeTracker/stopTimer',
  async ({ projectId, taskId, listId }, { rejectWithValue }) => {
    try {
      const res = await api.post('time/update', {
        project_id: projectId,
        task_id: taskId,
        list_id: listId || '',
      })
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const addCustomTime = createAsyncThunk(
  'timeTracker/addCustomTime',
  async ({ projectId, taskId, start, stop }, { rejectWithValue }) => {
    try {
      const res = await api.post('custom-time', { project_id: projectId, task_id: taskId, start, stop })
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const deleteTimeLog = createAsyncThunk(
  'timeTracker/deleteTimeLog',
  async ({ timeId }, { rejectWithValue }) => {
    try {
      await api.post(`time/${timeId}/delete`)
      return timeId
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const fetchOthersTime = createAsyncThunk(
  'timeTracker/fetchOthersTime',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('others-time', params)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const fetchReportSummary = createAsyncThunk(
  'timeTracker/fetchReportSummary',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('report-summary', params)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const timeTrackerSlice = createSlice({
  name: 'timeTracker',
  initialState,
  reducers: {
    setRunningTimer(state, action) { state.runningTimer = action.payload },
    clearRunningTimer(state) { state.runningTimer = null },
    resetTimeTracker() { return initialState },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startTimer.pending, (state) => { state.loading = true })
      .addCase(startTimer.fulfilled, (state, action) => {
        state.loading = false
        // Response may be { time: { data, meta } } or direct data
        const payload = action.payload
        state.runningTimer = {
          ...payload,
          task_id: payload.task_id || payload.time?.meta?.task_id,
          running: true,
        }
      })
      .addCase(startTimer.rejected, (state) => { state.loading = false })
      .addCase(stopTimer.pending, (state) => { state.loading = true })
      .addCase(stopTimer.fulfilled, (state, action) => {
        state.loading = false
        state.runningTimer = null
        // Add completed time log to list
        const entry = action.payload
        if (entry?.id) {
          // Replace if exists, otherwise push
          const idx = state.timeLogs.findIndex(l => l.id === entry.id)
          if (idx >= 0) state.timeLogs[idx] = entry
          else state.timeLogs.push(entry)
        }
      })
      .addCase(stopTimer.rejected, (state) => { state.loading = false })
      .addCase(addCustomTime.fulfilled, (state, action) => {
        if (action.payload?.id) {
          state.timeLogs.push(action.payload)
        }
      })
      .addCase(deleteTimeLog.fulfilled, (state, action) => {
        state.timeLogs = state.timeLogs.filter(l => l.id !== action.payload)
      })
      .addCase(fetchOthersTime.fulfilled, (state, action) => {
        state.timeLogs = Array.isArray(action.payload) ? action.payload : []
        state.othersLogs = state.timeLogs
      })
      .addCase(fetchReportSummary.fulfilled, (state, action) => {
        state.reportSummary = action.payload
      })
  },
})

export const { setRunningTimer, clearRunningTimer, resetTimeTracker } = timeTrackerSlice.actions
export default timeTrackerSlice.reducer
