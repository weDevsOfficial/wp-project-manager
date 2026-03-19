import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useProApi } from '@hooks/useProApi'

const api = useProApi()

const initialState = {
  links: [],      // dependency links between tasks
  loading: false,
}

export const createLink = createAsyncThunk(
  'gantt/createLink',
  async ({ projectId, source, target, type }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/gantt`, { source, target, type })
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const deleteLink = createAsyncThunk(
  'gantt/deleteLink',
  async ({ projectId, linkId }, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/gantt/${linkId}/delete`)
      return linkId
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const ganttSlice = createSlice({
  name: 'gantt',
  initialState,
  reducers: {
    setLinks(state, action) { state.links = action.payload },
    resetGantt() { return initialState },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLink.fulfilled, (state, action) => {
        state.links.push(action.payload)
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
        state.links = state.links.filter(l => l.id !== action.payload)
      })
  },
})

export const { setLinks, resetGantt } = ganttSlice.actions
export default ganttSlice.reducer
