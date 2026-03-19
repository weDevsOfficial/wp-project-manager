import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useProApi } from '@hooks/useProApi'

const api = useProApi()

const initialState = {
  fields: [],       // field definitions for a project
  loading: false,
  saving: false,
}

// Vue fetches: GET pm-pro/v2/projects/{pid}/custom-fields/?with=value&task_id={tid}
export const fetchCustomFields = createAsyncThunk(
  'customFields/fetchFields',
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      const params = { with: 'value' }
      if (taskId) params.task_id = taskId
      const res = await api.get(`projects/${projectId}/custom-fields`, params)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const createCustomField = createAsyncThunk(
  'customFields/createField',
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/custom-fields`, payload)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const updateCustomField = createAsyncThunk(
  'customFields/updateField',
  async ({ projectId, fieldId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/custom-fields/${fieldId}/update`, payload)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const deleteCustomField = createAsyncThunk(
  'customFields/deleteField',
  async ({ projectId, fieldId }, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/custom-fields/${fieldId}/delete`)
      return fieldId
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const setCustomFieldValue = createAsyncThunk(
  'customFields/setFieldValue',
  async ({ projectId, fieldId, taskId, value }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/custom-fields/${fieldId}/tasks/${taskId}/update`, { value })
      return { fieldId, taskId, value, data: res.data ?? res }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const customFieldsSlice = createSlice({
  name: 'customFields',
  initialState,
  reducers: {
    resetCustomFields() { return initialState },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomFields.pending, (state) => { state.loading = true })
      .addCase(fetchCustomFields.fulfilled, (state, action) => {
        state.loading = false
        state.fields = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchCustomFields.rejected, (state) => { state.loading = false })
      .addCase(createCustomField.fulfilled, (state, action) => {
        state.fields.push(action.payload)
      })
      .addCase(updateCustomField.fulfilled, (state, action) => {
        const idx = state.fields.findIndex(f => f.id === action.payload?.id)
        if (idx >= 0) state.fields[idx] = action.payload
      })
      .addCase(deleteCustomField.fulfilled, (state, action) => {
        state.fields = state.fields.filter(f => f.id !== action.payload)
      })
  },
})

export const { resetCustomFields } = customFieldsSlice.actions
export default customFieldsSlice.reducer
