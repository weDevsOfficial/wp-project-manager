import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useApi } from '@hooks/useApi'
import { resetProjectState } from './actions'

const api = useApi()

// ── State ─────────────────────────────────────────────

const initialState = {
  items:       [],
  loading:     false,
  formOpen:    false,
  editingId:   null,
  detailId:    null,
  filter:      'all',    // all | upcoming | at-risk | overdue | completed
  sort:        'date',   // date | progress | title
}

// ── Async thunks ──────────────────────────────────────

export const fetchMilestones = createAsyncThunk(
  'milestones/fetchAll',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`projects/${projectId}/milestones`, {
        with: 'discussion_boards,tasks',
        per_page: 50,
      })
      return res.data ?? []
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to load milestones')
    }
  },
)

export const createMilestone = createAsyncThunk(
  'milestones/create',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/milestones`, {
        ...data,
        project_id: projectId,
      })
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to create milestone')
    }
  },
)

export const updateMilestone = createAsyncThunk(
  'milestones/update',
  async ({ projectId, milestoneId, data }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `projects/${projectId}/milestones/${milestoneId}/update`,
        { ...data, project_id: projectId },
      )
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to update milestone')
    }
  },
)

export const deleteMilestone = createAsyncThunk(
  'milestones/delete',
  async ({ projectId, milestoneId }, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/milestones/${milestoneId}/delete`)
      return milestoneId
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to delete milestone')
    }
  },
)

export const toggleMilestonePrivacy = createAsyncThunk(
  'milestones/togglePrivacy',
  async ({ projectId, milestoneId, isPrivate }, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/milestones/privacy/${milestoneId}`, {
        is_private: isPrivate,
      })
      return { milestoneId, isPrivate }
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to update privacy')
    }
  },
)

// ── Slice ─────────────────────────────────────────────

const milestonesSlice = createSlice({
  name: 'milestones',
  initialState,
  reducers: {
    openForm(state, action) {
      state.formOpen = true
      state.editingId = action.payload ?? null
    },
    closeForm(state) {
      state.formOpen = false
      state.editingId = null
    },
    openDetail(state, action) {
      state.detailId = action.payload
    },
    closeDetail(state) {
      state.detailId = null
    },
    setFilter(state, action) {
      state.filter = action.payload
    },
    setSort(state, action) {
      state.sort = action.payload
    },
    removeTaskFromMilestone(state, action) {
      const { milestoneId, taskId } = action.payload
      const milestone = state.items.find(m => m.id === milestoneId)
      if (milestone?.tasks?.data) {
        milestone.tasks.data = milestone.tasks.data.filter(t => t.id !== taskId)
        if (milestone.meta) {
          milestone.meta.total_direct_tasks = Math.max(0, (milestone.meta.total_direct_tasks || 1) - 1)
        }
      }
    },
    addTaskToMilestone(state, action) {
      const { milestoneId, task } = action.payload
      const milestone = state.items.find(m => m.id === milestoneId)
      if (!milestone) return
      if (!milestone.tasks) milestone.tasks = { data: [] }
      if (!Array.isArray(milestone.tasks.data)) milestone.tasks.data = []
      if (!milestone.tasks.data.some(t => t.id === task.id)) {
        milestone.tasks.data.push(task)
        if (milestone.meta) {
          milestone.meta.total_direct_tasks = (milestone.meta.total_direct_tasks || 0) + 1
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder.addCase(fetchMilestones.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchMilestones.fulfilled, (state, action) => {
      state.items = action.payload
      state.loading = false
    })
    builder.addCase(fetchMilestones.rejected, (state) => {
      state.loading = false
    })

    // Create
    builder.addCase(createMilestone.fulfilled, (state, action) => {
      if (action.payload) {
        state.items.unshift(action.payload)
      }
      state.formOpen = false
      state.editingId = null
    })

    // Update — replace in-place
    builder.addCase(updateMilestone.fulfilled, (state, action) => {
      if (!action.payload) return
      const idx = state.items.findIndex((m) => m.id === action.payload.id)
      if (idx !== -1) {
        state.items[idx] = action.payload
      }
    })

    // Delete
    builder.addCase(deleteMilestone.fulfilled, (state, action) => {
      state.items = state.items.filter((m) => m.id !== action.payload)
    })

    // Privacy toggle — optimistic update
    builder.addCase(toggleMilestonePrivacy.fulfilled, (state, action) => {
      const { milestoneId, isPrivate } = action.payload
      const item = state.items.find((m) => m.id === milestoneId)
      if (item) {
        if (!item.meta) item.meta = {}
        item.meta.privacy = isPrivate
      }
    })

    // Inline task sync when task sheet fetches or updates a task
    const syncTaskInMilestones = (state, updatedTask, { preservePrivacy = false } = {}) => {
      if (!updatedTask?.id) return
      state.items.forEach((milestone) => {
        const tasks = milestone.tasks?.data
        if (!Array.isArray(tasks)) return
        const idx = tasks.findIndex((t) => t.id === updatedTask.id)
        if (idx !== -1) {
          const existing = tasks[idx]
          const mergedMeta = { ...existing.meta, ...updatedTask.meta }
          if (preservePrivacy) {
            // fetchTask reads privacy from pm_meta table (string, may be stale/absent).
            // Always keep the value already in state — it came from fetchMilestones
            // which uses is_private column (authoritative source).
            mergedMeta.privacy = existing.meta?.privacy
          }
          tasks[idx] = { ...existing, ...updatedTask, meta: mergedMeta }
        }
      })
    }
    builder.addCase('tasks/fetchTask/fulfilled', (state, action) => {
      syncTaskInMilestones(state, action.payload, { preservePrivacy: true })
    })
    builder.addCase('tasks/updateTask/fulfilled', (state, action) => {
      syncTaskInMilestones(state, action.payload)
    })
    builder.addCase('tasks/changeTaskStatus/fulfilled', (state, action) => {
      if (!action.payload) return
      const { taskId, status } = action.payload
      syncTaskInMilestones(state, { id: taskId, status })
    })
    builder.addCase('taskLists/updateTaskPrivacy', (state, action) => {
      const { taskId, privacy } = action.payload
      state.items.forEach((milestone) => {
        const tasks = milestone.tasks?.data
        if (!Array.isArray(tasks)) return
        const task = tasks.find(t => t.id === taskId)
        if (task) task.meta = { ...task.meta, privacy }
      })
    })

    // Global reset when navigating between projects
    builder.addCase(resetProjectState, () => initialState)
  },
})

export const {
  openForm,
  closeForm,
  openDetail,
  closeDetail,
  setFilter,
  setSort,
  removeTaskFromMilestone,
  addTaskToMilestone,
} = milestonesSlice.actions

export default milestonesSlice.reducer
