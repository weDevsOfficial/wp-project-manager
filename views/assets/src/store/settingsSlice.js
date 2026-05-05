import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useApi } from '@hooks/useApi'
import { formatSettings, getSetting } from '@lib/utils'

const api = useApi()

// ── Async thunks ──────────────────────────────────────────

export const saveGeneral = createAsyncThunk(
  'settings/saveGeneral',
  async (data, { rejectWithValue }) => {
    try {
      let payload = { ...data }
      if (typeof pm_apply_filters === 'function') {
        payload = pm_apply_filters('setting_data', payload)
      }
      const res = await api.post(
        'settings',
        { settings: formatSettings(payload) }
      )
      res.data.forEach((item) => { PM_Vars.settings[item.key] = item.value })
      return res
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to save settings')
    }
  }
)

export const saveEmail = createAsyncThunk(
  'settings/saveEmail',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(
        'settings',
        { settings: formatSettings(data) }
      )
      res.data.forEach((item) => { PM_Vars.settings[item.key] = item.value })
      return res
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to save email settings')
    }
  }
)

export const savePusher = createAsyncThunk(
  'settings/savePusher',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(
        'settings',
        { settings: formatSettings(data) }
      )
      res.data.forEach((item) => { PM_Vars.settings[item.key] = item.value })
      return res
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to save Pusher settings')
    }
  }
)

export const loadAiSettings = createAsyncThunk(
  'settings/loadAiSettings',
  async ({ provider, preserveProvider }, { rejectWithValue, signal }) => {
    try {
      const base = PM_Vars.rest_url + `settings/ai?provider=${encodeURIComponent(provider)}&is_admin=${encodeURIComponent(PM_Vars.is_admin)}`
      const res = await fetch(base, {
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'X-WP-Nonce': PM_Vars.permission },
        signal,
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        return rejectWithValue(json?.message ?? res.statusText ?? 'API Error')
      }
      const json = await res.json().catch(() => ({}))
      return { ...json, preserveProvider, requestedProvider: provider }
    } catch (e) {
      if (e.name === 'AbortError') return rejectWithValue('aborted')
      return rejectWithValue(e.message)
    }
  }
)

export const testAiConnection = createAsyncThunk(
  'settings/testAiConnection',
  async ({ provider, apiKey }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        'settings/ai/test-connection',
        { provider, api_key: apiKey || '' }
      )
      return res
    } catch (e) {
      return rejectWithValue(e.message ?? 'Connection failed.')
    }
  }
)

export const saveAiSettings = createAsyncThunk(
  'settings/saveAiSettings',
  async ({ ai, apiKey }, { rejectWithValue }) => {
    try {
      const data = {
        ai_provider:    ai.ai_provider,
        ai_model:       ai.ai_model,
        ai_max_tokens:  ai.ai_max_tokens,
        ai_temperature: ai.ai_temperature,
      }
      // Only send the API key when the user actually entered a new one
      if (apiKey && apiKey.trim()) {
        data.ai_api_key = apiKey.trim()
      }
      let filteredData = data
      if (typeof pm_apply_filters === 'function') {
        filteredData = pm_apply_filters('ai_setting_data', data)
      }
      const res = await api.post(
        'settings/ai',
        { settings: formatSettings(filteredData) }
      )
      return res
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to save AI settings')
    }
  }
)

export const fetchTaskTypes = createAsyncThunk(
  'settings/fetchTaskTypes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('settings/task-types')
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to load task types')
    }
  }
)

export const createTaskType = createAsyncThunk(
  'settings/createTaskType',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('settings/task-types', data)
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to create task type')
    }
  }
)

export const updateTaskType = createAsyncThunk(
  'settings/updateTaskType',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.post(`settings/task-types/${id}`, data)
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to update task type')
    }
  }
)

export const deleteTaskType = createAsyncThunk(
  'settings/deleteTaskType',
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`settings/task-types/${id}/delete`)
      return id
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to delete task type')
    }
  }
)

export const fetchSettingsProjects = createAsyncThunk(
  'settings/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('projects', { per_page: -1, with: 'assignees' })
      return res.data
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const saveUserMap = createAsyncThunk(
  'settings/saveUserMap',
  async (usernames, { rejectWithValue }) => {
    try {
      const res = await api.post('save_users_map_name', { usernames })
      return res?.message ?? 'User mapping saved'
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to save user map')
    }
  }
)

// ── Slice ─────────────────────────────────────────────────

const initialState = {
  isPro:   !!PM_Vars.is_pro,
  isAdmin: !!PM_Vars.is_admin,

  general: {
    upload_limit:              Number(getSetting('upload_limit', 2)),
    project_per_page:          Number(getSetting('project_per_page', 10)),
    list_per_page:             Number(getSetting('list_per_page', 10)),
    incomplete_tasks_per_page: Number(getSetting('incomplete_tasks_per_page', 10)),
    complete_tasks_per_page:   Number(getSetting('complete_tasks_per_page', 10)),
    managing_capability:       getSetting('managing_capability', []),
    project_create_capability: getSetting('project_create_capability', []),
  },
  generalSaving: false,

  email: {
    from_email:      getSetting('from_email', PM_Vars.current_user?.data?.user_email ?? ''),
    link_to_backend: getSetting('link_to_backend', false),
    email_type:      getSetting('email_type', 'text/html'),
    enable_bcc:      getSetting('enable_bcc', false),
  },
  emailSaving: false,

  pusher: {
    pusher_app_key:                getSetting('pusher_app_key', ''),
    pusher_secret:                 getSetting('pusher_secret', ''),
    pusher_app_id:                 getSetting('pusher_app_id', ''),
    pusher_cluster:                getSetting('pusher_cluster', ''),
    pusher_link_to_backend:        getSetting('pusher_link_to_backend', false),
    pusher_enable:                 getSetting('pusher_enable', true),
    pusher_notify_task_assign:     getSetting('pusher_notify_task_assign', true),
    pusher_notify_task_status:     getSetting('pusher_notify_task_status', true),
    pusher_notify_task_update:     getSetting('pusher_notify_task_update', true),
    pusher_notify_comment_new:     getSetting('pusher_notify_comment_new', true),
    pusher_notify_comment_update:  getSetting('pusher_notify_comment_update', true),
    pusher_notify_message_new:     getSetting('pusher_notify_message_new', true),
    pusher_notify_message_update:  getSetting('pusher_notify_message_update', true),
  },
  pusherSaving: false,

  ai: {
    ai_provider:    getSetting('ai_provider', 'openai'),
    ai_model:       getSetting('ai_model', 'gpt-4o-mini'),
    ai_max_tokens:  Number(getSetting('ai_max_tokens', 2000)),
    ai_temperature: parseFloat(String(getSetting('ai_temperature', 0.7))),
  },
  aiApiState: { api_key: '', api_key_saved: false, api_key_mask: '' },
  aiModels: { openai: [], anthropic: [], google: [] },
  aiSaving: false,
  aiTestingConn: false,
  aiLoading: false,

  taskTypes: [],
  taskTypesLoaded: false,
  taskTypesLoading: false,

  projects: [],
  userMapUsers: [],
  userMapLoading: false,
  userMapSaving: false,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAiProvider(state, action) {
      state.ai.ai_provider = action.payload
      state.aiApiState = { api_key: '', api_key_saved: false, api_key_mask: '' }
    },
    setAiModel(state, action) {
      state.ai.ai_model = action.payload
    },
    setAiMaxTokens(state, action) {
      state.ai.ai_max_tokens = action.payload
    },
    setAiTemperature(state, action) {
      state.ai.ai_temperature = action.payload
    },
    selectProjectForMap(state, action) {
      state.userMapUsers = action.payload
    },
  },
  extraReducers: (builder) => {
    // General
    builder.addCase(saveGeneral.pending, (state) => { state.generalSaving = true })
    builder.addCase(saveGeneral.fulfilled, (state) => { state.generalSaving = false })
    builder.addCase(saveGeneral.rejected, (state) => { state.generalSaving = false })

    // Email
    builder.addCase(saveEmail.pending, (state) => { state.emailSaving = true })
    builder.addCase(saveEmail.fulfilled, (state) => { state.emailSaving = false })
    builder.addCase(saveEmail.rejected, (state) => { state.emailSaving = false })

    // Pusher
    builder.addCase(savePusher.pending, (state) => { state.pusherSaving = true })
    builder.addCase(savePusher.fulfilled, (state) => { state.pusherSaving = false })
    builder.addCase(savePusher.rejected, (state) => { state.pusherSaving = false })

    // AI
    builder.addCase(loadAiSettings.pending, (state) => { state.aiLoading = true })
    builder.addCase(loadAiSettings.fulfilled, (state, action) => {
      state.aiLoading = false
      const { data, models, preserveProvider, requestedProvider } = action.payload
      if (models) {
        ;['openai', 'anthropic', 'google'].forEach((p) => {
          if (models[p]) state.aiModels[p] = models[p]
        })
      }
      if (data) {
        data.forEach((item) => {
          switch (item.key) {
            case 'ai_provider':
              if (!preserveProvider && item.value) state.ai.ai_provider = item.value
              else if (preserveProvider) state.ai.ai_provider = requestedProvider
              break
            case 'ai_model':
              if (item.value) state.ai.ai_model = item.value
              break
            case 'ai_max_tokens':
              if (item.value) state.ai.ai_max_tokens = Number(item.value)
              break
            case 'ai_temperature':
              if (item.value !== undefined) state.ai.ai_temperature = parseFloat(String(item.value))
              break
            default:
              if (typeof item.key === 'string' && item.key.startsWith('ai_api_key_')) {
                const providerToCheck = preserveProvider ? requestedProvider : state.ai.ai_provider
                if (item.key === `ai_api_key_${providerToCheck}`) {
                  if (item.value) {
                    state.aiApiState.api_key_saved = true
                    state.aiApiState.api_key       = item.value
                    state.aiApiState.api_key_mask  = item.value
                  } else {
                    state.aiApiState.api_key_saved = false
                    state.aiApiState.api_key       = ''
                  }
                }
              } else {
                PM_Vars.settings[item.key] = item.value
              }
          }
        })
        // Ensure selected model is available
        const availModels = state.aiModels[state.ai.ai_provider] ?? []
        if (availModels.length > 0 && !availModels.find((m) => m.value === state.ai.ai_model)) {
          state.ai.ai_model = availModels[0].value
        }
      }
    })
    builder.addCase(loadAiSettings.rejected, (state) => { state.aiLoading = false })

    builder.addCase(testAiConnection.pending, (state) => { state.aiTestingConn = true })
    builder.addCase(testAiConnection.fulfilled, (state) => { state.aiTestingConn = false })
    builder.addCase(testAiConnection.rejected, (state) => { state.aiTestingConn = false })

    builder.addCase(saveAiSettings.pending, (state) => { state.aiSaving = true })
    builder.addCase(saveAiSettings.fulfilled, (state, action) => {
      state.aiSaving = false
      if (action.payload.data) {
        action.payload.data.forEach((item) => {
          if (typeof item.key === 'string' && item.key.startsWith('ai_api_key_')) {
            if (item.key === `ai_api_key_${state.ai.ai_provider}` && item.value) {
              state.aiApiState.api_key_saved = true
              state.aiApiState.api_key       = item.value
              state.aiApiState.api_key_mask  = item.value
            }
          } else {
            PM_Vars.settings[item.key] = item.value
          }
        })
      }
    })
    builder.addCase(saveAiSettings.rejected, (state) => { state.aiSaving = false })

    // Task Types
    builder.addCase(fetchTaskTypes.pending, (state) => { state.taskTypesLoading = true })
    builder.addCase(fetchTaskTypes.fulfilled, (state, action) => {
      state.taskTypesLoading = false
      state.taskTypesLoaded  = true
      state.taskTypes        = action.payload
    })
    builder.addCase(fetchTaskTypes.rejected, (state) => { state.taskTypesLoading = false })

    builder.addCase(createTaskType.fulfilled, (state, action) => {
      state.taskTypes.push(action.payload)
    })
    builder.addCase(updateTaskType.fulfilled, (state, action) => {
      const idx = state.taskTypes.findIndex((t) => t.id === action.payload.id)
      if (idx !== -1) state.taskTypes[idx] = action.payload
    })
    builder.addCase(deleteTaskType.fulfilled, (state, action) => {
      state.taskTypes = state.taskTypes.filter((t) => t.id !== action.payload)
    })

    // User Map projects
    builder.addCase(fetchSettingsProjects.pending, (state) => { state.userMapLoading = true })
    builder.addCase(fetchSettingsProjects.fulfilled, (state, action) => {
      state.userMapLoading = false
      state.projects       = action.payload
    })
    builder.addCase(fetchSettingsProjects.rejected, (state) => { state.userMapLoading = false })

    builder.addCase(saveUserMap.pending, (state) => { state.userMapSaving = true })
    builder.addCase(saveUserMap.fulfilled, (state) => { state.userMapSaving = false })
    builder.addCase(saveUserMap.rejected, (state) => { state.userMapSaving = false })
  },
})

export const {
  setAiProvider, setAiModel, setAiMaxTokens, setAiTemperature,
  selectProjectForMap,
} = settingsSlice.actions

export default settingsSlice.reducer
