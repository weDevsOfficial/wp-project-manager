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
} = milestonesSlice.actions

export default milestonesSlice.reducer
