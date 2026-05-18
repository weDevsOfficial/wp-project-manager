import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useApi } from '@hooks/useApi'
import { resetProjectState } from './actions'
import { updateTask, fetchTask, changeTaskStatus } from './tasksSlice'

const api = useApi()

// ── State ─────────────────────────────────────────────

const initialState = {
  lists:          [],
  currentList:    null,
  loading:        false,
  loadingMore:    false,
  expandedIds:    [],
  projectId:      null,
  listsMeta:      { total: 0, total_pages: 1, current_page: 1, per_page: 10 },
  listComments:   [],
}

// ── Async thunks ──────────────────────────────────────

export const fetchTaskLists = createAsyncThunk(
  'taskLists/fetchTaskLists',
  async ({ projectId, page = 1 }, { rejectWithValue }) => {
    try {
      const perPage = parseInt(String(PM_Vars.settings?.list_per_page), 10) || 10
      const incompletePerPage = parseInt(String(PM_Vars.settings?.incomplete_tasks_per_page), 10) || 10
      const completePerPage = parseInt(String(PM_Vars.settings?.complete_tasks_per_page), 10) || 10
      const res = await api.get(
        `projects/${projectId}/task-lists`,
        {
          per_page: perPage,
          page,
          with: 'incomplete_tasks,complete_tasks,assignees,labels',
          incomplete_task_per_page: incompletePerPage,
          complete_task_per_page: completePerPage,
          status: 1, // active lists only
        },
      )
      return { data: res.data ?? [], meta: res.meta?.pagination ?? {}, projectId, page }
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

// ── List comment thunks ──────────────────────────────

export const addListComment = createAsyncThunk(
  'taskLists/addListComment',
  async ({ projectId, listId, content }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/comments`, {
        content,
        commentable_id: listId,
        commentable_type: 'task_list',
        mentioned_users: '',
        notify_users: '',
        project_id: projectId,
      })
      return { listId, comment: res.data }
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to add comment')
    }
  },
)

export const updateListComment = createAsyncThunk(
  'taskLists/updateListComment',
  async ({ projectId, commentId, content }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/comments/${commentId}`, {
        content,
        project_id: projectId,
      })
      return { commentId, content, data: res.data }
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to update comment')
    }
  },
)

export const deleteListComment = createAsyncThunk(
  'taskLists/deleteListComment',
  async ({ projectId, commentId }, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/comments/${commentId}/delete`)
      return { commentId }
    } catch (e) {
      return rejectWithValue(e.message ?? 'Failed to delete comment')
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
      state.listComments = []
      state.expandedIds = []
      state.projectId = null
    },
    clearListComments(state) {
      state.listComments = []
    },
    // Optimistic: push a new task into a list's incomplete_tasks
    // incrementTotal: true when creating a new task, false when loading more existing tasks
    addTaskToList(state, action) {
      const { listId, task, incrementTotal = true } = action.payload
      const addTo = (list) => {
        if (!list) return
        const exists = list.incomplete_tasks.data.some(t => t.id === task.id)
          || list.complete_tasks.data.some(t => t.id === task.id)
        if (exists) return
        if (task.status === 1 || task.status === '1' || task.status === 'complete' || task.status === true) {
          list.complete_tasks.data.push(task)
        } else {
          if (incrementTotal) {
            list.incomplete_tasks.data.unshift(task)
            list.meta.total_incomplete_tasks++
          } else {
            list.incomplete_tasks.data.push(task)
          }
        }
      }
      addTo(state.lists.find(l => l.id === listId))
      if (state.currentList?.id === listId) addTo(state.currentList)
    },
    // Optimistic: remove task from list
    removeTaskFromList(state, action) {
      const { listId, taskId } = action.payload
      const removeFrom = (list) => {
        if (!list) return
        const inIdx = list.incomplete_tasks.data.findIndex(t => t.id === taskId)
        if (inIdx !== -1) {
          list.incomplete_tasks.data.splice(inIdx, 1)
          list.meta.total_incomplete_tasks = Math.max(0, list.meta.total_incomplete_tasks - 1)
        }
        const coIdx = list.complete_tasks.data.findIndex(t => t.id === taskId)
        if (coIdx !== -1) {
          list.complete_tasks.data.splice(coIdx, 1)
          list.meta.total_complete_tasks = Math.max(0, list.meta.total_complete_tasks - 1)
        }
      }
      removeFrom(state.lists.find(l => l.id === listId))
      if (state.currentList?.id === listId) removeFrom(state.currentList)
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
    // Optimistic: update task privacy in-place
    updateTaskPrivacy(state, action) {
      const { taskId, privacy } = action.payload
      const updateIn = (list) => {
        if (!list) return
        const inTask = list.incomplete_tasks.data.find(t => t.id === taskId)
        if (inTask) inTask.meta = { ...inTask.meta, privacy }
        const coTask = list.complete_tasks.data.find(t => t.id === taskId)
        if (coTask) coTask.meta = { ...coTask.meta, privacy }
      }
      state.lists.forEach(list => updateIn(list))
      if (state.currentList) updateIn(state.currentList)
    },
    // Optimistic: move task between incomplete <-> complete within a list
    toggleTaskInList(state, action) {
      const { listId, taskId, newStatus } = action.payload
      const toggleInList = (list) => {
        if (!list) return
        if (newStatus === 1) {
          const idx = list.incomplete_tasks.data.findIndex(t => t.id === taskId)
          if (idx !== -1) {
            const [task] = list.incomplete_tasks.data.splice(idx, 1)
            task.status = 1
            list.complete_tasks.data.unshift(task)
            list.meta.total_incomplete_tasks = Math.max(0, list.meta.total_incomplete_tasks - 1)
            list.meta.total_complete_tasks++
          }
        } else {
          const idx = list.complete_tasks.data.findIndex(t => t.id === taskId)
          if (idx !== -1) {
            const [task] = list.complete_tasks.data.splice(idx, 1)
            task.status = 0
            list.incomplete_tasks.data.unshift(task)
            list.meta.total_complete_tasks = Math.max(0, list.meta.total_complete_tasks - 1)
            list.meta.total_incomplete_tasks++
          }
        }
      }
      toggleInList(state.lists.find(l => l.id === listId))
      if (state.currentList?.id === listId) toggleInList(state.currentList)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTaskLists.pending, (state) => {
      state.loading = true
      state.lists = []          // Clear stale data from previous project
      state.expandedIds = []
    })
    builder.addCase(fetchTaskLists.fulfilled, (state, action) => {
      state.loading = false
      state.lists = action.payload.data
      state.projectId = action.payload.projectId
      // Store pagination meta from API
      const meta = action.payload.meta
      if (meta && meta.total !== undefined) {
        state.listsMeta = {
          total:        parseInt(meta.total, 10)        || 0,
          total_pages:  parseInt(meta.total_pages, 10)  || 1,
          current_page: parseInt(meta.current_page, 10) || parseInt(action.payload.page, 10) || 1,
          per_page:     parseInt(meta.per_page, 10)     || 10,
        }
      }
      // Auto-expand all lists on load (including page changes)
      state.expandedIds = state.lists.map(l => l.id)
    })
    builder.addCase(fetchTaskLists.rejected, (state) => { state.loading = false })

    builder.addCase(fetchSingleList.fulfilled, (state, action) => {
      state.currentList = action.payload
      state.listComments = action.payload?.comments?.data ?? []
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
        // Update pagination meta (matches Vue's afterNewListupdateListsMeta)
        const newTotal = (parseInt(state.listsMeta.total, 10) || 0) + 1
        const perPage = parseInt(state.listsMeta.per_page, 10) || 10
        state.listsMeta.total = newTotal
        state.listsMeta.total_pages = Math.ceil(newTotal / perPage) || 1
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
      // Update pagination meta (matches Vue's afterDeleteList)
      const newTotal = Math.max(0, (parseInt(state.listsMeta.total, 10) || 0) - 1)
      const perPage = parseInt(state.listsMeta.per_page, 10) || 10
      state.listsMeta.total = newTotal
      state.listsMeta.total_pages = Math.ceil(newTotal / perPage) || 1
    })

    builder.addCase(reorderLists.fulfilled, (state, action) => {
      const orderMap = new Map(action.payload.map(o => [o.id, o.index]))
      state.lists.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0))
    })

    // ── Sync task changes from tasksSlice back into lists ──
    // When a task is updated in TaskDetailSheet, reflect changes in the list view
    const syncTaskInList = (list, updatedTask, { preservePrivacy = false } = {}) => {
      if (!list) return
      const merge = (existing) => {
        const mergedMeta = { ...existing.meta, ...updatedTask.meta }
        if (preservePrivacy) mergedMeta.privacy = existing.meta?.privacy
        return { ...existing, ...updatedTask, meta: mergedMeta }
      }
      const inIdx = list.incomplete_tasks.data.findIndex(t => t.id === updatedTask.id)
      if (inIdx !== -1) {
        list.incomplete_tasks.data[inIdx] = merge(list.incomplete_tasks.data[inIdx])
      }
      const coIdx = list.complete_tasks.data.findIndex(t => t.id === updatedTask.id)
      if (coIdx !== -1) {
        list.complete_tasks.data[coIdx] = merge(list.complete_tasks.data[coIdx])
      }
    }
    const syncTaskInLists = (state, updatedTask, opts) => {
      if (!updatedTask?.id) return
      state.lists.forEach(list => syncTaskInList(list, updatedTask, opts))
      if (state.currentList) syncTaskInList(state.currentList, updatedTask, opts)
    }

    builder.addCase(updateTask.fulfilled, (state, action) => {
      if (action.payload) syncTaskInLists(state, action.payload)
    })
    builder.addCase(fetchTask.fulfilled, (state, action) => {
      if (action.payload) syncTaskInLists(state, action.payload, { preservePrivacy: true })
    })

    // ── List comment reducers ──
    builder.addCase(addListComment.fulfilled, (state, action) => {
      if (action.payload?.comment) {
        state.listComments.push(action.payload.comment)
      }
    })
    builder.addCase(updateListComment.fulfilled, (state, action) => {
      const { commentId, content } = action.payload
      const idx = state.listComments.findIndex(c => c.id === commentId)
      if (idx >= 0) state.listComments[idx] = { ...state.listComments[idx], content }
    })
    builder.addCase(deleteListComment.fulfilled, (state, action) => {
      state.listComments = state.listComments.filter(c => c.id !== action.payload.commentId)
    })

    // Global project reset — clear all project-scoped data
    builder.addCase(resetProjectState, () => initialState)
  },
})

export const {
  setProjectId, toggleExpand, expandAll, collapseAll, clearLists,
  addTaskToList, removeTaskFromList, updateTaskPrivacy, toggleTaskInList,
  reorderListsLocal, reorderTasksLocal, clearListComments,
} = taskListsSlice.actions

export default taskListsSlice.reducer
