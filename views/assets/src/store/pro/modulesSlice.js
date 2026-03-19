import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useProApi } from '@hooks/useProApi'

const api = useProApi()

const initialState = {
  allModules: {},    // { kanbanboard: { name, description, thumbnail }, ... }
  activeModules: [], // [{ path: 'kanbanboard', ... }, ...]
  loading: false,
}

export const fetchModules = createAsyncThunk(
  'modules/fetchModules',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('module-lists')
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const toggleModule = createAsyncThunk(
  'modules/toggleModule',
  async ({ moduleId, active }, { rejectWithValue }) => {
    try {
      const type = active ? 'activate' : 'deactivate'
      const res = await api.post('module-update', { module: moduleId, type })
      return { moduleId, active, data: res.data ?? res }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const modulesSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    resetModules() { return initialState },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModules.pending, (state) => { state.loading = true })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload
        state.allModules = data?.all ?? data ?? {}
        state.activeModules = Array.isArray(data?.active) ? data.active : []
      })
      .addCase(fetchModules.rejected, (state) => { state.loading = false })
      .addCase(toggleModule.fulfilled, (state, action) => {
        if (action.payload.active) {
          // Add to active list
          state.activeModules.push(action.payload.data)
        } else {
          // Remove from active list
          state.activeModules = state.activeModules.filter(m => m.path !== action.payload.moduleId)
        }
      })
  },
})

export const { resetModules } = modulesSlice.actions
export default modulesSlice.reducer
