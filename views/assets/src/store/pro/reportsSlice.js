import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useApi } from '@hooks/useApi'
import { useProApi } from '@hooks/useProApi'

// Reports use BOTH APIs:
// - pm/v2 (free) for task/activity data queries
// - pm-pro/v2 for advance-report and CSV/PDF exports
const api = useApi()
const proApi = useProApi()

const initialState = {
  reportData: null,
  reportMeta: null,
  reportType: 'overdue-tasks',
  assignedUsers: [],
  allProjects: [],
  filters: {
    project_id: '',
    user_id: '',
    start_date: '',
    end_date: '',
    status: 0,
    page: 1,
    per_page: 20,
  },
  loading: false,
  // Summary report state (pm-pro/v2/report-summary)
  summaryData: null,
  summaryLoading: false,
}

// Fetch assigned users for filter dropdowns
export const fetchAssignedUsers = createAsyncThunk(
  'reports/fetchAssignedUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('assigned_users')
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Fetch all projects for filter dropdown
export const fetchReportProjects = createAsyncThunk(
  'reports/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('projects', { per_page: -1 })
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Overdue tasks — pm/v2/tasks with due_date filters
export const fetchOverdueTasks = createAsyncThunk(
  'reports/fetchOverdueTasks',
  async ({ filters = {} }, { rejectWithValue }) => {
    try {
      const params = {
        status: 0,
        with: 'project,task_list',
        per_page: filters.per_page || 20,
        pages: filters.page || 1,
        due_date_operator: 'less_than',
      }
      if (filters.start_date) {
        params.start_at = filters.start_date
        params.start_at_operator = 'greater_than_equal'
      }
      if (filters.end_date) params.due_date = filters.end_date
      if (filters.project_id) params.project_id = filters.project_id
      if (filters.user_id) params.users = filters.user_id
      const res = await api.get('tasks', params)
      return res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Completed tasks — pm/v2/tasks with completed_at filters
export const fetchCompletedTasks = createAsyncThunk(
  'reports/fetchCompletedTasks',
  async ({ filters = {} }, { rejectWithValue }) => {
    try {
      const params = {
        status: 1,
        with: 'project,task_list',
        per_page: filters.per_page || 20,
        pages: filters.page || 1,
      }
      if (filters.start_date) params.completed_at_start = filters.start_date
      if (filters.end_date) params.completed_at = filters.end_date
      if (filters.project_id) params.project_id = filters.project_id
      if (filters.user_id) params.users = filters.user_id
      const res = await api.get('tasks', params)
      return res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// User activities — pm/v2/activities
export const fetchUserActivities = createAsyncThunk(
  'reports/fetchUserActivities',
  async ({ filters = {} }, { rejectWithValue }) => {
    try {
      const params = {
        with: 'actor,project',
        per_page: filters.per_page || 20,
        page: filters.page || 1,
        orderby: 'created_at|ASC',
      }
      if (filters.start_date) params.updated_at_start = filters.start_date
      if (filters.end_date) params.updated_at = filters.end_date
      if (filters.project_id) params.project_id = filters.project_id
      if (filters.user_id) params.user_id = filters.user_id
      const res = await api.get('activities', params)
      return res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Unassigned tasks — pm/v2/tasks with users='null'
export const fetchUnassignedTasks = createAsyncThunk(
  'reports/fetchUnassignedTasks',
  async ({ filters = {} }, { rejectWithValue }) => {
    try {
      const params = {
        status: 0,
        users: 'null',
        with: 'project,task_list',
        per_page: filters.per_page || 20,
        pages: filters.page || 1,
      }
      if (filters.start_date) {
        params.start_at = filters.start_date
        params.start_at_operator = 'greater_than_equal'
      }
      if (filters.end_date) {
        params.due_date = filters.end_date
        params.due_date_operator = 'less_than|or,null'
      }
      if (filters.project_id) params.project_id = filters.project_id
      const res = await api.get('tasks', params)
      return res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Milestone tasks — pm/v2/tasks with milestone filter
export const fetchMilestoneTasks = createAsyncThunk(
  'reports/fetchMilestoneTasks',
  async ({ filters = {} }, { rejectWithValue }) => {
    try {
      const params = {
        status: 0,
        with: 'project,task_list,milestone',
        per_page: filters.per_page || 20,
        pages: filters.page || 1,
      }
      if (filters.project_id) params.project_id = filters.project_id
      if (filters.milestone_id) params.milestone = filters.milestone_id
      if (filters.start_date) {
        params.start_at = filters.start_date
        params.start_at_operator = 'greater_than_equal'
      }
      if (filters.end_date) {
        params.due_date = filters.end_date
        params.due_date_operator = 'less_than_equal'
      }
      const res = await api.get('tasks', params)
      return res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Advanced report — pm-pro/v2/advance-report
export const fetchAdvanceReport = createAsyncThunk(
  'reports/fetchAdvanceReport',
  async ({ advanceFilters = [], page = 1, perPage = 20 }, { rejectWithValue }) => {
    try {
      const res = await proApi.post('advance-report', {
        filters: advanceFilters,
        page,
        per_page: perPage,
      })
      return res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Report Summary — pm-pro/v2/report-summary (charts + tables)
export const fetchReportSummary = createAsyncThunk(
  'reports/fetchReportSummary',
  async ({ type = 'summary', summaryType = 'all_project', startDate, endDate, users, projects, estimated_time = 'task_estimation' }, { rejectWithValue }) => {
    try {
      const params = { type, summaryType, estimated_time }
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      if (users) params.users = users
      if (projects && projects.length > 0) params.projects = projects
      const res = await proApi.get('report-summary', params)
      return res?.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Report Summary CSV export
export const exportReportSummary = createAsyncThunk(
  'reports/exportSummary',
  async ({ type, summaryType, startDate, endDate, users, projects, estimated_time }, { rejectWithValue }) => {
    try {
      const base = PM_Vars.api_base_url ?? PM_Vars.rest_url ?? ''
      const nonce = PM_Vars.permission || ''
      const params = new URLSearchParams()
      params.set('_wpnonce', nonce)
      params.set('currentUser', PM_Vars.current_user?.data?.id || PM_Vars.current_user?.ID || 1)
      if (type) params.set('type', type)
      if (summaryType) params.set('summaryType', summaryType)
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
      if (users) params.set('users', users)
      if (estimated_time) params.set('estimated_time', estimated_time)
      if (projects && projects.length > 0) {
        projects.forEach(p => params.append('projects[]', p))
      }
      window.location.href = `${base}pm-pro/v2/report-summary/csv?${params.toString()}`
      return true
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// CSV/PDF export — opens in new tab
export const exportReport = createAsyncThunk(
  'reports/export',
  async ({ reportType, format = 'csv' }, { rejectWithValue }) => {
    try {
      const base = PM_Vars.api_base_url ?? PM_Vars.rest_url ?? ''
      const userId = PM_Vars.current_user?.data?.id || PM_Vars.user_id || 1
      const nonce = PM_Vars.permission || ''
      const url = `${base}pm-pro/v2/users/${userId}/advance-report/${reportType}/${format}?_wpnonce=${nonce}`
      window.open(url, '_blank')
      return true
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReportType(state, action) { state.reportType = action.payload },
    setFilters(state, action) { state.filters = { ...state.filters, ...action.payload } },
    resetFilters(state) { state.filters = initialState.filters },
    resetReports() { return initialState },
    clearSummary(state) { state.summaryData = null },
  },
  extraReducers: (builder) => {
    // Assigned users
    builder.addCase(fetchAssignedUsers.fulfilled, (state, action) => {
      state.assignedUsers = Array.isArray(action.payload) ? action.payload : []
    })
    // Projects
    builder.addCase(fetchReportProjects.fulfilled, (state, action) => {
      state.allProjects = Array.isArray(action.payload) ? action.payload : []
    })

    // All report fetches share the same loading/fulfilled pattern
    const reportCases = [
      fetchOverdueTasks, fetchCompletedTasks, fetchUserActivities,
      fetchUnassignedTasks, fetchMilestoneTasks, fetchAdvanceReport,
    ]
    reportCases.forEach(thunk => {
      builder
        .addCase(thunk.pending, (state) => { state.loading = true })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false
          state.reportData = action.payload?.data ?? action.payload ?? []
          state.reportMeta = action.payload?.meta ?? null
        })
        .addCase(thunk.rejected, (state) => { state.loading = false })
    })

    // Summary report
    builder
      .addCase(fetchReportSummary.pending, (state) => { state.summaryLoading = true })
      .addCase(fetchReportSummary.fulfilled, (state, action) => {
        state.summaryLoading = false
        state.summaryData = action.payload
      })
      .addCase(fetchReportSummary.rejected, (state) => {
        state.summaryLoading = false
        state.summaryData = null
      })
  },
})

export const { setReportType, setFilters, resetFilters, resetReports, clearSummary } = reportsSlice.actions
export default reportsSlice.reducer
