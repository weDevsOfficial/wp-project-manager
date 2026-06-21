import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useApi } from '@hooks/useApi'

const api = useApi()

const initialState = {
  status:   { configured: false, picker_ready: false, drive_enabled: false, connected: false, account_email: '', expired: false },
  settings: { client_id: '', has_secret: false, api_key: '', app_id: '', drive_enabled: false, picker_ready: false, redirect_uri: '' },
  statusLoading: false,
  settingsLoading: false,
  saving: false,
  attachmentsByTask: {},
  attachLoading: false,
}

export const fetchStatus = createAsyncThunk(
  'googleWorkspace/fetchStatus',
  async (_, { rejectWithValue }) => {
    try { const res = await api.get('google-workspace/status'); return res.data ?? res }
    catch (e) { return rejectWithValue(e.message) }
  },
)

export const fetchSettings = createAsyncThunk(
  'googleWorkspace/fetchSettings',
  async (_, { rejectWithValue }) => {
    try { const res = await api.get('google-workspace/settings'); return res.data ?? res }
    catch (e) { return rejectWithValue(e.message) }
  },
)

export const saveSettings = createAsyncThunk(
  'googleWorkspace/saveSettings',
  async ({ client_id, client_secret, api_key, app_id, drive_enabled }, { rejectWithValue }) => {
    try { const res = await api.post('google-workspace/settings', { client_id, client_secret, api_key, app_id, drive_enabled }); return res.data ?? res }
    catch (e) { return rejectWithValue(e.message) }
  },
)

export const getAuthUrl = createAsyncThunk(
  'googleWorkspace/getAuthUrl',
  async (_, { rejectWithValue }) => {
    try { const res = await api.get('google-workspace/auth-url'); return (res.data ?? res).auth_url }
    catch (e) { return rejectWithValue(e.message) }
  },
)

export const disconnect = createAsyncThunk(
  'googleWorkspace/disconnect',
  async (_, { rejectWithValue }) => {
    try { await api.post('google-workspace/disconnect'); return true }
    catch (e) { return rejectWithValue(e.message) }
  },
)

export const fetchPickerConfig = createAsyncThunk(
  'googleWorkspace/fetchPickerConfig',
  async (_, { rejectWithValue }) => {
    try { const res = await api.get('google-workspace/drive/picker-config'); return res.data ?? res }
    catch (e) { return rejectWithValue(e.message) }
  },
)

export const fetchAttachments = createAsyncThunk(
  'googleWorkspace/fetchAttachments',
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`projects/${projectId}/tasks/${taskId}/google-drive`)
      return { taskId, files: res.data ?? res }
    } catch (e) { return rejectWithValue(e.message) }
  },
)

export const attachFile = createAsyncThunk(
  'googleWorkspace/attachFile',
  async ({ projectId, taskId, file }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/tasks/${taskId}/google-drive`, { file })
      return { taskId, file: res.data ?? res }
    } catch (e) { return rejectWithValue(e.message) }
  },
)

export const detachFile = createAsyncThunk(
  'googleWorkspace/detachFile',
  async ({ projectId, taskId, id }, { rejectWithValue }) => {
    try {
      await api.del(`projects/${projectId}/tasks/${taskId}/google-drive/${id}`)
      return { taskId, id }
    } catch (e) { return rejectWithValue(e.message) }
  },
)

const slice = createSlice({
  name: 'googleWorkspace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatus.pending,   (s) => { s.statusLoading = true })
      .addCase(fetchStatus.fulfilled, (s, a) => { s.statusLoading = false; s.status = a.payload })
      .addCase(fetchStatus.rejected,  (s) => { s.statusLoading = false })

      .addCase(fetchSettings.pending,   (s) => { s.settingsLoading = true })
      .addCase(fetchSettings.fulfilled, (s, a) => { s.settingsLoading = false; s.settings = a.payload })
      .addCase(fetchSettings.rejected,  (s) => { s.settingsLoading = false })

      .addCase(saveSettings.pending,   (s) => { s.saving = true })
      .addCase(saveSettings.fulfilled, (s, a) => { s.saving = false; s.settings = a.payload; s.status.configured = a.payload.configured; s.status.picker_ready = a.payload.picker_ready; s.status.drive_enabled = a.payload.drive_enabled })
      .addCase(saveSettings.rejected,  (s) => { s.saving = false })

      .addCase(disconnect.fulfilled, (s) => { s.status = { ...s.status, connected: false, account_email: '', expired: false } })

      .addCase(fetchAttachments.fulfilled, (s, a) => { s.attachmentsByTask[a.payload.taskId] = a.payload.files })
      .addCase(attachFile.pending,   (s) => { s.attachLoading = true })
      .addCase(attachFile.fulfilled, (s, a) => {
        s.attachLoading = false
        const list = s.attachmentsByTask[a.payload.taskId] || []
        if (!list.some(f => f.id === a.payload.file.id)) {
          s.attachmentsByTask[a.payload.taskId] = [a.payload.file, ...list]
        }
      })
      .addCase(attachFile.rejected,  (s) => { s.attachLoading = false })

      .addCase(detachFile.fulfilled, (s, a) => {
        const list = s.attachmentsByTask[a.payload.taskId] || []
        s.attachmentsByTask[a.payload.taskId] = list.filter(f => f.id !== a.payload.id)
      })
  },
})

export default slice.reducer
