import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useApi } from '@hooks/useApi'

const api = useApi()

// ── State ─────────────────────────────────────────────

const initialState = {
  lists:          [],
  currentList:    null,
  loading:        false,
  expandedIds:    [],
  projectId:      null,
}

// ── Async thunks ──────────────────────────────────────

export const fetchTaskLists = createAsyncThunk(
  'taskLists/fetchTaskLists',
  async (projectId, { rejectWithValue }) => {
    try {
      const perPage = parseInt(String(PM_Vars.settings?.list_per_page), 10) || 10
      const incompletePerPage = parseInt(String(PM_Vars.settings?.incomplete_tasks_per_page), 10) || 10
      const completePerPage = parseInt(String(PM_Vars.settings?.complete_tasks_per_page), 10) || 5
      const res = await api.get(
        `projects/${projectId}/task-lists`,
        {
          per_page: perPage,
          with: 'incomplete_tasks,complete_tasks,assignees',
          incomplete_task_per_page: incompletePerPage,
          complete_task_per_page: completePerPage,
          status: 1, // active lists only
        },
      )
      return { data: res.data ?? [], projectId }
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to load task lists')
    }
  },
)

export const fetchSingleList = createAsyncThunk(
  'taskLists/fetchSingleList',
  async ({ projectId, listId }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `projects/${projectId}/task-lists/${listId}`,
        { with: 'incomplete_tasks,complete_tasks,comments' },
      )
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to load task list')
    }
  },
)

export const createTaskList = createAsyncThunk(
  'taskLists/createTaskList',
  async (
    { projectId, title, description, milestone },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post(
        `projects/${projectId}/task-lists`,
        { title, description, milestone },
      )
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to create task list')
    }
  },
)

export const updateTaskList = createAsyncThunk(
  'taskLists/updateTaskList',
  async (
    { projectId, listId, title, description },
    { rejectWithValue },
  ) => {
    try {
      const id = parseInt(listId)
      const res = await api.post(
        `projects/${projectId}/task-lists/${id}/update`,
        { id, title, description },
      )
      return res.data
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to update task list')
    }
  },
)

export const deleteTaskList = createAsyncThunk(
  'taskLists/deleteTaskList',
  async (
    { projectId, listId },
    { rejectWithValue },
  ) => {
    try {
      await api.post(`projects/${projectId}/task-lists/${listId}/delete`)
      return listId
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to delete task list')
    }
  },
)

export const reorderLists = createAsyncThunk(
  'taskLists/reorderLists',
  async (
    { projectId, orders },
    { rejectWithValue },
  ) => {
    try {
      await api.post(`projects/${projectId}/lists/sorting`, { orders })
      return orders
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to reorder lists')
    }
  },
)

// ── Slice ─────────────────────────────────────────────

const taskListsSlice = createSlice({
  name: 'taskLists',
  initialState,
  reducers: {
    setProjectId(state, action) {
      state.projectId = action.payload
    },
    toggleExpand(state, action) {
      const id = action.payload
      if (state.expandedIds.includes(id)) {
        state.expandedIds = state.expandedIds.filter(i => i !== id)
      } else {
        state.expandedIds.push(id)
      }
    },
    expandAll(state) {
      state.expandedIds = state.lists.map(l => l.id)
    },
    collapseAll(state) {
      state.expandedIds = []
    },
    clearLists(state) {
      state.lists = []
      state.currentList = null
      state.expandedIds = []
      state.projectId = null
    },
    // Optimistic: push a new task into a list's incomplete_tasks
    addTaskToList(state, action) {
      const list = state.lists.find(l => l.id === action.payload.listId)
      if (list) {
        list.incomplete_tasks.data.unshift(action.payload.task)
        list.meta.total_incomplete_tasks++
      }
    },
    // Optimistic: remove task from list
    removeTaskFromList(state, action) {
      const list = state.lists.find(l => l.id === action.payload.listId)
      if (list) {
        const inIdx = list.incomplete_tasks.data.findIndex(t => t.id === action.payload.taskId)
        if (inIdx !== -1) {
          list.incomplete_tasks.data.splice(inIdx, 1)
          list.meta.total_incomplete_tasks = Math.max(0, list.meta.total_incomplete_tasks - 1)
        }
        const coIdx = list.complete_tasks.data.findIndex(t => t.id === action.payload.taskId)
        if (coIdx !== -1) {
          list.complete_tasks.data.splice(coIdx, 1)
          list.meta.total_complete_tasks = Math.max(0, list.meta.total_complete_tasks - 1)
        }
      }
    },
    // Optimistic: reorder lists locally (before API call)
    reorderListsLocal(state, action) {
      const { fromIndex, toIndex } = action.payload
      const [moved] = state.lists.splice(fromIndex, 1)
      state.lists.splice(toIndex, 0, moved)
    },
    // Optimistic: reorder tasks within a list
    reorderTasksLocal(state, action) {
      const { listId, fromIndex, toIndex } = action.payload
      const list = state.lists.find(l => l.id === listId)
      if (list) {
        const [moved] = list.incomplete_tasks.data.splice(fromIndex, 1)
        list.incomplete_tasks.data.splice(toIndex, 0, moved)
      }
    },
    // Optimistic: move task between incomplete <-> complete within a list
    toggleTaskInList(state, action) {
      const list = state.lists.find(l => l.id === action.payload.listId)
      if (!list) return
      const { taskId, newStatus } = action.payload
      if (newStatus === 1) {
        // incomplete -> complete
        const idx = list.incomplete_tasks.data.findIndex(t => t.id === taskId)
        if (idx !== -1) {
          const [task] = list.incomplete_tasks.data.splice(idx, 1)
          task.status = 1
          list.complete_tasks.data.unshift(task)
          list.meta.total_incomplete_tasks = Math.max(0, list.meta.total_incomplete_tasks - 1)
          list.meta.total_complete_tasks++
        }
      } else {
        // complete -> incomplete
        const idx = list.complete_tasks.data.findIndex(t => t.id === taskId)
        if (idx !== -1) {
          const [task] = list.complete_tasks.data.splice(idx, 1)
          task.status = 0
          list.incomplete_tasks.data.unshift(task)
          list.meta.total_complete_tasks = Math.max(0, list.meta.total_complete_tasks - 1)
          list.meta.total_incomplete_tasks++
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTaskLists.pending, (state) => { state.loading = true })
    builder.addCase(fetchTaskLists.fulfilled, (state, action) => {
      state.loading = false
      state.lists = action.payload.data
      state.projectId = action.payload.projectId
      // Auto-expand all lists on first load
      if (state.expandedIds.length === 0) {
        state.expandedIds = state.lists.map(l => l.id)
      }
    })
    builder.addCase(fetchTaskLists.rejected, (state) => { state.loading = false })

    builder.addCase(fetchSingleList.fulfilled, (state, action) => {
      state.currentList = action.payload
    })

    builder.addCase(createTaskList.fulfilled, (state, action) => {
      if (action.payload) {
        // Ensure the new list has the required nested structures
        const newList = {
          ...action.payload,
          incomplete_tasks: action.payload.incomplete_tasks ?? { data: [] },
          complete_tasks: action.payload.complete_tasks ?? { data: [] },
          meta: action.payload.meta ?? { total_complete_tasks: 0, total_incomplete_tasks: 0, privacy: 0 },
        }
        state.lists.push(newList)
        state.expandedIds.push(newList.id)
      }
    })

    builder.addCase(updateTaskList.fulfilled, (state, action) => {
      if (action.payload) {
        const idx = state.lists.findIndex(l => l.id === action.payload.id)
        if (idx !== -1) {
          state.lists[idx] = { ...state.lists[idx], ...action.payload }
        }
      }
    })

    builder.addCase(deleteTaskList.fulfilled, (state, action) => {
      state.lists = state.lists.filter(l => l.id !== action.payload)
      state.expandedIds = state.expandedIds.filter(id => id !== action.payload)
    })

    builder.addCase(reorderLists.fulfilled, (state, action) => {
      const orderMap = new Map(action.payload.map(o => [o.id, o.index]))
      state.lists.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0))
    })
  },
})

export const {
  setProjectId, toggleExpand, expandAll, collapseAll, clearLists,
  addTaskToList, removeTaskFromList, toggleTaskInList,
  reorderListsLocal, reorderTasksLocal,
} = taskListsSlice.actions

export default taskListsSlice.reducer
