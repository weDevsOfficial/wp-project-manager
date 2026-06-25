import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useApi } from '@hooks/useApi'

const api = useApi()

const initialState = {
  status:   { configured: false, picker_ready: false, drive_enabled: false, calendar_enabled: false, meet_enabled: false, connected: false, account_email: '', expired: false, calendar_connected: false, meet_connected: false, drive_user_on: true, drive_comments_on: true },
  settings: { client_id: '', has_secret: false, api_key: '', app_id: '', drive_enabled: false, picker_ready: false, redirect_uri: '' },
  statusLoading: false,
  statusFetched: false, // true once status/settings resolved — lets UI prefer live store over stale PM_Vars
  settingsLoading: false,
  saving: false,
  attachmentsByTask: {},
  attachmentsByKey: {},   // { 'type:id': [files] }
  attachLoading: false,

  // Per-project Drive role access
  canUseByProject: {},      // { [projectId]: bool }
  accessByProject: {},      // { [projectId]: { co_worker, client } }
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
  async ({ client_id, client_secret, api_key, app_id, drive_enabled, drive_comments }, { rejectWithValue }) => {
    try {
      const body = { client_id, client_secret, api_key, app_id, drive_enabled }
      if (drive_comments !== undefined) body.drive_comments = drive_comments ? 1 : 0
      const res = await api.post('google-workspace/settings', body)
      return res.data ?? res
    } catch (e) { return rejectWithValue(e.message) }
  },
)

export const getAuthUrl = createAsyncThunk(
  'googleWorkspace/getAuthUrl',
  async (arg, { rejectWithValue }) => {
    const params = {}
    if (arg && arg.withCalendar) params.with_calendar = 1
    try { const res = await api.get('google-workspace/auth-url', Object.keys(params).length ? params : undefined); return (res.data ?? res).auth_url }
    catch (e) { return rejectWithValue(e.message) }
  },
)

export const saveDrivePref = createAsyncThunk(
  'googleWorkspace/saveDrivePref',
  async ({ drive_on }, { rejectWithValue }) => {
    try { const res = await api.post('google-workspace/my-prefs', { drive_on: drive_on ? 1 : 0 }); return (res.data ?? res).drive_user_on }
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

const akey = (type, id) => `${type}:${id}`

export const fetchAttachmentsFor = createAsyncThunk(
  'googleWorkspace/fetchAttachmentsFor',
  async ({ projectId, attachableType, attachableId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`projects/${projectId}/google-drive`, { attachable_type: attachableType, attachable_id: attachableId })
      return { key: akey(attachableType, attachableId), files: res.data ?? res }
    } catch (e) { return rejectWithValue(e.message) }
  },
)

export const attachFileFor = createAsyncThunk(
  'googleWorkspace/attachFileFor',
  async ({ projectId, attachableType, attachableId, file }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/google-drive`, { attachable_type: attachableType, attachable_id: attachableId, file })
      return { key: akey(attachableType, attachableId), file: res.data ?? res }
    } catch (e) { return rejectWithValue(e.message) }
  },
)

export const detachFileFor = createAsyncThunk(
  'googleWorkspace/detachFileFor',
  async ({ projectId, attachableType, attachableId, id }, { rejectWithValue }) => {
    try {
      await api.del(`projects/${projectId}/google-drive/${id}`)
      return { key: akey(attachableType, attachableId), id }
    } catch (e) { return rejectWithValue(e.message) }
  },
)

export const fetchCanUse = createAsyncThunk(
  'googleWorkspace/fetchCanUse',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`projects/${projectId}/google-workspace/can-use`)
      return { projectId, canUse: !!(res.data ?? res).can_use }
    } catch (e) { return rejectWithValue(e.message) }
  },
)

export const fetchProjectAccess = createAsyncThunk(
  'googleWorkspace/fetchProjectAccess',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`projects/${projectId}/google-workspace/access`)
      return { projectId, access: res.data ?? res }
    } catch (e) { return rejectWithValue(e.message) }
  },
)

export const saveProjectAccess = createAsyncThunk(
  'googleWorkspace/saveProjectAccess',
  async ({ projectId, co_worker, client }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/google-workspace/access`, { co_worker, client })
      return { projectId, access: res.data ?? res }
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
      .addCase(fetchStatus.fulfilled, (s, a) => { s.statusLoading = false; s.statusFetched = true; s.status = a.payload })
      .addCase(fetchStatus.rejected,  (s) => { s.statusLoading = false })

      .addCase(fetchSettings.pending,   (s) => { s.settingsLoading = true })
      .addCase(fetchSettings.fulfilled, (s, a) => { s.settingsLoading = false; s.settings = a.payload })
      .addCase(fetchSettings.rejected,  (s) => { s.settingsLoading = false })

      .addCase(saveSettings.pending,   (s) => { s.saving = true })
      .addCase(saveSettings.fulfilled, (s, a) => { s.saving = false; s.statusFetched = true; s.settings = a.payload; s.status.configured = a.payload.configured; s.status.picker_ready = a.payload.picker_ready; s.status.drive_enabled = a.payload.drive_enabled; s.status.calendar_enabled = a.payload.calendar_enabled; s.status.meet_enabled = a.payload.meet_enabled; s.status.drive_comments_on = a.payload.drive_comments })
      .addCase(saveSettings.rejected,  (s) => { s.saving = false })

      .addCase(disconnect.fulfilled, (s) => { s.status = { ...s.status, connected: false, account_email: '', expired: false, calendar_connected: false, meet_connected: false } })
      .addCase(saveDrivePref.fulfilled, (s, a) => { s.status.drive_user_on = a.payload })

      .addCase(fetchAttachmentsFor.fulfilled, (s, a) => { s.attachmentsByKey[a.payload.key] = a.payload.files })
      .addCase(attachFileFor.pending,   (s) => { s.attachLoading = true })
      .addCase(attachFileFor.fulfilled, (s, a) => {
        s.attachLoading = false
        const list = s.attachmentsByKey[a.payload.key] || []
        if (!list.some(f => f.id === a.payload.file.id)) {
          s.attachmentsByKey[a.payload.key] = [a.payload.file, ...list]
        }
      })
      .addCase(attachFileFor.rejected,  (s) => { s.attachLoading = false })
      .addCase(detachFileFor.fulfilled, (s, a) => {
        const list = s.attachmentsByKey[a.payload.key] || []
        s.attachmentsByKey[a.payload.key] = list.filter(f => f.id !== a.payload.id)
      })

      .addCase(fetchCanUse.fulfilled, (s, a) => { s.canUseByProject[a.payload.projectId] = a.payload.canUse })
      .addCase(fetchProjectAccess.fulfilled, (s, a) => { s.accessByProject[a.payload.projectId] = a.payload.access })
      .addCase(saveProjectAccess.fulfilled, (s, a) => { s.accessByProject[a.payload.projectId] = a.payload.access })

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
