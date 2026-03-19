import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useProApi } from '@hooks/useProApi'

const api = useProApi()

const initialState = {
  events: [],
  projects: [],
  users: [],
  resources: [],
  loading: false,
}

export const fetchCalendarEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('calendar-events', params)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const fetchCalendarProjects = createAsyncThunk(
  'calendar/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('calendar-projects')
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const fetchCalendarResources = createAsyncThunk(
  'calendar/fetchResources',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('calendar-resource')
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    resetCalendar() { return initialState },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarEvents.pending, (state) => { state.loading = true })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchCalendarEvents.rejected, (state) => { state.loading = false })
      .addCase(fetchCalendarProjects.fulfilled, (state, action) => {
        const p = action.payload
        // API returns { projects: [...], users: [...] } or flat array
        if (Array.isArray(p)) {
          state.projects = p
        } else if (p && typeof p === 'object') {
          const prj = p.projects ?? p.data
          state.projects = Array.isArray(prj) ? prj : prj ? Object.values(prj) : []
          const usr = p.users
          if (usr) state.users = Array.isArray(usr) ? usr : Object.values(usr)
        } else {
          state.projects = []
        }
      })
      .addCase(fetchCalendarResources.fulfilled, (state, action) => {
        state.resources = Array.isArray(action.payload) ? action.payload : []
      })
  },
})

export const { resetCalendar } = calendarSlice.actions
export default calendarSlice.reducer
