import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useApi } from '@hooks/useApi'
import { useProApi } from '@hooks/useProApi'

const freeApi = useApi()
const api = useProApi()

const initialState = {
  labels: [],
  loading: false,
}

// Fetch project labels — labels are on the project object, loaded via free API
export const fetchProjectLabels = createAsyncThunk(
  'labels/fetchProjectLabels',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await freeApi.get(`projects/${projectId}`, { with: 'labels' })
      return res.data?.labels?.data ?? []
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const createLabel = createAsyncThunk(
  'labels/createLabel',
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/settings/labels`, payload)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const updateLabel = createAsyncThunk(
  'labels/updateLabel',
  async ({ projectId, labelId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/settings/labels/${labelId}`, payload)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const deleteLabel = createAsyncThunk(
  'labels/deleteLabel',
  async ({ projectId, labelId }, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/settings/labels/${labelId}/delete`)
      return labelId
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    setLabels(state, action) { state.labels = action.payload },
    resetLabels() { return initialState },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectLabels.pending, (state) => { state.loading = true })
      .addCase(fetchProjectLabels.fulfilled, (state, action) => {
        state.loading = false
        state.labels = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchProjectLabels.rejected, (state) => { state.loading = false })
      .addCase(createLabel.fulfilled, (state, action) => {
        state.labels.push(action.payload)
      })
      .addCase(updateLabel.fulfilled, (state, action) => {
        const idx = state.labels.findIndex(l => l.id === action.payload?.id)
        if (idx >= 0) state.labels[idx] = action.payload
      })
      .addCase(deleteLabel.fulfilled, (state, action) => {
        state.labels = state.labels.filter(l => l.id !== action.payload)
      })
  },
})

export const { setLabels, resetLabels } = labelsSlice.actions
export default labelsSlice.reducer
