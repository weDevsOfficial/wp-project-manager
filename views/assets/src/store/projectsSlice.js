import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useApi } from '@hooks/useApi'

const api = useApi()

// BuddyPress group scoping — when PM is rendered inside a BP group,
// PM_BP_Vars.group_id is set by the BuddyPress extension.
function bpGroupParams(params = {}) {
  if (typeof PM_BP_Vars !== 'undefined' && PM_BP_Vars.group_id) {
    return { ...params, group_id: PM_BP_Vars.group_id }
  }
  return params
}

// ── Async thunks ──────────────────────────────────────────

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params, { getState, rejectWithValue }) => {
    try {
      const state = getState().projects
      const perPage = parseInt(String(PM_Vars.settings?.project_per_page), 10) || 10
      const query = {
        per_page: params?.per_page ?? perPage,
        page: params?.page ?? state.currentPage,
        with: 'assignees',
        project_meta: 'all',
        orderby: params?.orderby ?? state.orderBy ?? 'id:desc',
        ...params,
      }
      // Only send status filter if not "all"
      if (state.activeFilter !== 'all') {
        query.status = params?.status ?? state.status
      }
      if (state.categoryId) query.category = state.categoryId
      // Use advanced/projects endpoint — returns Fractal-transformed data with per-project meta
      // The Helper (projects) endpoint has meta counting commented out
      const res = await api.get('advanced/projects', bpGroupParams(query))
      return res
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to load projects')
    }
  }
)

export const toggleFavourite = createAsyncThunk(
  'projects/toggleFavourite',
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const state = getState().projects
      const project = state.projects.find(p => p.id === projectId)
      // Send the new desired state — API expects favourite: 'true' to add, anything else to remove
      const newFavourite = !project?.favourite
      await api.post(`projects/${projectId}/favourite`, {
        favourite: newFavourite ? 'true' : 'false',
      })
      return projectId
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to toggle favourite')
    }
  }
)

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/delete`)
      return projectId
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to delete project')
    }
  }
)

export const toggleProjectStatus = createAsyncThunk(
  'projects/toggleProjectStatus',
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const state = getState().projects
      const project = state.projects.find(p => p.id === projectId)
      if (!project) return rejectWithValue('Project not found')

      const isComplete = project.status === 'complete' || project.status === '1' || project.status === 1
      const newStatus = isComplete ? 'incomplete' : 'complete'
      const assignees = (project.assignees?.data ?? []).map(u => ({
        user_id: u.id,
        role_id: u.roles?.data?.[0]?.id ?? 1,
      }))

      await api.post(`projects/${projectId}/update`, {
        id: projectId,
        title: project.title,
        status: newStatus,
        assignees,
      })
      return { projectId, newStatus, currentFilter: state.status }
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to update project status')
    }
  }
)

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('projects', bpGroupParams(payload))
      return res
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to create project')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'projects/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    const state = getState().projects
    if (state.categoriesLoaded) return state.categories
    try {
      const res = await api.get('categories')
      return res.data ?? []
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const fetchRoles = createAsyncThunk(
  'projects/fetchRoles',
  async (_, { getState, rejectWithValue }) => {
    const state = getState().projects
    if (state.rolesLoaded) return state.roles
    try {
      const res = await api.get('roles')
      return res.data ?? []
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, ...payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/update`, payload)
      return res
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to update project')
    }
  }
)

export const searchUsers = createAsyncThunk(
  'projects/searchUsers',
  async (query) => {
    try {
      const res = await api.get('users/search', { query })
      return res.data ?? []
    } catch {
      return []
    }
  }
)

export const fetchProjectAssignees = createAsyncThunk(
  'projects/fetchProjectAssignees',
  async (projectId, { getState, rejectWithValue }) => {
    const existing = getState().projects.projectAssignees[String(projectId)]
    if (existing) return { projectId: String(projectId), assignees: existing }
    try {
      const res = await api.get(`projects/${projectId}`, { with: 'assignees' })
      const p = res?.data ?? res
      const assignees = p?.assignees?.data || []
      return {
        projectId: String(projectId),
        assignees: Array.isArray(assignees) ? assignees : Object.values(assignees || {}),
      }
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to load project assignees')
    }
  }
)

// ── State ─────────────────────────────────────────────────

const initialState = {
  projects:     [],
  loading:      false,
  currentPage:  1,
  totalPages:   1,
  total:        0,
  perPage:      parseInt(String(PM_Vars.settings?.project_per_page), 10) || 10,
  status:       'incomplete',
  activeFilter: 'incomplete',
  categoryId:   undefined,
  orderBy:      'id:desc',
  viewMode:     localStorage.getItem('pm-project-view') ?? 'grid',

  projectsMeta: { total_incomplete: 0, total_complete: 0, total_favourite: 0 },

  categories:       [],
  categoriesLoaded: false,

  roles:       [],
  rolesLoaded: false,

  createSheetOpen: false,
  creating:        false,
  updating:        false,
  editSheetOpen:   false,
  editProject:     null,
  searchingUsers:  false,

  projectAssignees: {}, // { [projectId]: User[] }
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setStatus(state, action) {
      state.activeFilter = action.payload
      state.currentPage = 1
      if (action.payload === 'all') {
        state.status = 'incomplete'
      } else {
        state.status = action.payload
      }
    },
    setPage(state, action) {
      state.currentPage = action.payload
    },
    setCategory(state, action) {
      state.categoryId = action.payload
      state.currentPage = 1
    },
    setOrderBy(state, action) {
      state.orderBy = action.payload
      state.currentPage = 1
    },
    setViewMode(state, action) {
      state.viewMode = action.payload
      localStorage.setItem('pm-project-view', action.payload)
    },
    setCreateSheetOpen(state, action) {
      state.createSheetOpen = action.payload
    },
    openEditSheet(state, action) {
      state.editProject = action.payload
      state.editSheetOpen = true
    },
    closeEditSheet(state) {
      state.editSheetOpen = false
      state.editProject = null
    },
    invalidateProjectAssignees(state, action) {
      const id = action.payload
      if (id == null) {
        state.projectAssignees = {}
      } else {
        delete state.projectAssignees[String(id)]
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => { state.loading = true })
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.loading  = false
      state.projects = action.payload.data ?? []
      state.perPage  = parseInt(String(PM_Vars.settings?.project_per_page), 10) || 10
      if (action.payload.meta?.pagination) {
        const p = action.payload.meta.pagination
        // Don't overwrite currentPage — setPage already set it before the API call.
        // Only update totalPages/total from the API response.
        state.totalPages = p.total_pages || 1
        state.total      = p.total || 0
        if (p.per_page) state.perPage = p.per_page
      }
      if (action.payload.meta) {
        const m = action.payload.meta
        if (typeof m.total_incomplete === 'number') state.projectsMeta.total_incomplete = m.total_incomplete
        if (typeof m.total_complete === 'number')   state.projectsMeta.total_complete   = m.total_complete
        if (typeof m.total_favourite === 'number')  state.projectsMeta.total_favourite  = m.total_favourite
      }
    })
    builder.addCase(fetchProjects.rejected, (state) => { state.loading = false })

    builder.addCase(toggleFavourite.fulfilled, (state, action) => {
      const project = state.projects.find(p => p.id === action.payload)
      if (project) {
        project.favourite = !project.favourite
        if (project.favourite) state.projectsMeta.total_favourite++
        else state.projectsMeta.total_favourite = Math.max(0, state.projectsMeta.total_favourite - 1)
      }
    })

    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload)
      state.total = Math.max(0, state.total - 1)
    })

    builder.addCase(toggleProjectStatus.fulfilled, (state, action) => {
      const { projectId, newStatus, currentFilter } = action.payload
      if (
        (currentFilter === 'incomplete' && newStatus === 'complete') ||
        (currentFilter === 'complete' && newStatus === 'incomplete')
      ) {
        state.projects = state.projects.filter(p => p.id !== projectId)
        state.total = Math.max(0, state.total - 1)
      } else {
        const project = state.projects.find(p => p.id === projectId)
        if (project) project.status = newStatus
      }
      if (newStatus === 'complete') {
        state.projectsMeta.total_incomplete = Math.max(0, state.projectsMeta.total_incomplete - 1)
        state.projectsMeta.total_complete++
      } else {
        state.projectsMeta.total_complete = Math.max(0, state.projectsMeta.total_complete - 1)
        state.projectsMeta.total_incomplete++
      }
    })

    builder.addCase(createProject.pending, (state) => { state.creating = true })
    builder.addCase(createProject.fulfilled, (state, action) => {
      state.creating = false
      if (action.payload.data) {
        if (state.status === 'incomplete') {
          state.projects.unshift(action.payload.data)
          state.total++
        }
        state.projectsMeta.total_incomplete++
        state.createSheetOpen = false
      }
    })
    builder.addCase(createProject.rejected, (state) => { state.creating = false })

    builder.addCase(updateProject.pending, (state) => { state.updating = true })
    builder.addCase(updateProject.fulfilled, (state, action) => {
      state.updating = false
      if (action.payload.data) {
        const idx = state.projects.findIndex(p => p.id === action.payload.data.id)
        if (idx !== -1) state.projects[idx] = action.payload.data
      }
      state.editSheetOpen = false
      state.editProject = null
    })
    builder.addCase(updateProject.rejected, (state) => { state.updating = false })

    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload
      state.categoriesLoaded = true
    })

    builder.addCase(fetchRoles.fulfilled, (state, action) => {
      // Deduplicate roles by slug (QA databases may have duplicate entries)
      const seen = new Set()
      state.roles = (action.payload || []).filter(role => {
        const key = role.slug || role.title
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      state.rolesLoaded = true
    })

    builder.addCase(searchUsers.pending, (state) => { state.searchingUsers = true })
    builder.addCase(searchUsers.fulfilled, (state) => { state.searchingUsers = false })
    builder.addCase(searchUsers.rejected, (state) => { state.searchingUsers = false })

    builder.addCase(fetchProjectAssignees.fulfilled, (state, action) => {
      const { projectId, assignees } = action.payload
      state.projectAssignees[projectId] = assignees
    })
  },
})

export const {
  setStatus, setPage, setCategory, setOrderBy, setViewMode, setCreateSheetOpen,
  openEditSheet, closeEditSheet, invalidateProjectAssignees,
} = projectsSlice.actions

export default projectsSlice.reducer
