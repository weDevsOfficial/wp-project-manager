import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@hooks/useApi'


const initialState = {
  boards: [],
  loading: false,
  saving: false,
  dragState: null,
}

export const fetchBoards = createAsyncThunk(
  'kanban/fetchBoards',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`projects/${projectId}/kanboard`)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const createBoard = createAsyncThunk(
  'kanban/createBoard',
  async ({ projectId, title }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/kanboard`, { board_title: title })
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const updateBoard = createAsyncThunk(
  'kanban/updateBoard',
  async ({ projectId, boardId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/kanboard/${boardId}/update`, payload)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const deleteBoard = createAsyncThunk(
  'kanban/deleteBoard',
  async ({ projectId, boardId }, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/kanboard/${boardId}/delete`)
      return boardId
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const reorderBoards = createAsyncThunk(
  'kanban/reorderBoards',
  async ({ projectId, boardOrders }, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/kanboard/board-order`, { board_orders: boardOrders })
      return boardOrders
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const reorderTasks = createAsyncThunk(
  'kanban/reorderTasks',
  async ({ projectId, boardId, taskOrders }, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/kanboard/task-order`, { board_id: boardId, task_orders: taskOrders })
      return { boardId, taskOrders }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const addTaskToBoard = createAsyncThunk(
  'kanban/addTaskToBoard',
  async ({ projectId, boardId, taskId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/kanboard/${boardId}/task/${taskId}`, {
        project_id: projectId,
        board_id: boardId,
        task_id: taskId,
      })
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const removeTaskFromBoard = createAsyncThunk(
  'kanban/removeTaskFromBoard',
  async ({ projectId, boardId, taskId }, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/kanboard/${boardId}/tasks/${taskId}/delete`)
      return { boardId, taskId }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const setBoardColor = createAsyncThunk(
  'kanban/setBoardColor',
  async ({ projectId, boardId, color }, { rejectWithValue }) => {
    try {
      await api.post(`projects/${projectId}/kanboard/${boardId}/header_background`, { header_background: color })
      return { boardId, color }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const saveAutomation = createAsyncThunk(
  'kanban/saveAutomation',
  async ({ projectId, boardId, automation }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/boards/${boardId}/automation`, automation)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const filterTasks = createAsyncThunk(
  'kanban/filterTasks',
  async ({ projectId, filters }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/kanboard/filter`, filters)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Step 2: fetch tasks for a single board column
export const fetchBoardTasks = createAsyncThunk(
  'kanban/fetchBoardTasks',
  async ({ projectId, boardId, page = 1, perPage = 50 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`projects/${projectId}/kanboard/${boardId}`, { page, per_page: perPage })
      const data = Array.isArray(res?.data) ? res.data : (res?.data ?? res)
      const meta = res?.meta ?? null
      return { boardId, tasks: data, meta, page }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const loadMoreBoardTasks = createAsyncThunk(
  'kanban/loadMoreBoardTasks',
  async ({ projectId, boardId, page, perPage = 50 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`projects/${projectId}/kanboard/${boardId}`, { page, per_page: perPage })
      const data = Array.isArray(res?.data) ? res.data : (res?.data ?? res)
      const meta = res?.meta ?? null
      return { boardId, tasks: data, meta }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const importTasks = createAsyncThunk(
  'kanban/importTasks',
  async ({ projectId, taskIds, boardId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/kanboard/import-tasks`, { items: taskIds, board_id: boardId })
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setDragState(state, action) { state.dragState = action.payload },
    clearDragState(state) { state.dragState = null },
    reorderBoardsLocal(state, action) {
      // action.payload = reordered array of board ids
      const orderedIds = action.payload
      state.boards = orderedIds.map(id => state.boards.find(b => String(b.id) === String(id))).filter(Boolean)
    },
    moveTaskBetweenBoards(state, action) {
      const { taskId, fromBoardId, toBoardId } = action.payload
      const fromBoard = state.boards.find(b => String(b.id) === String(fromBoardId))
      const toBoard   = state.boards.find(b => String(b.id) === String(toBoardId))
      if (!fromBoard || !toBoard) return
      const tasks = fromBoard.tasks?.data ?? fromBoard.tasks ?? []
      const taskIndex = tasks.findIndex(t => String(t.id) === String(taskId))
      if (taskIndex === -1) return
      const [task] = tasks.splice(taskIndex, 1)
      const toTasks = toBoard.tasks?.data ?? toBoard.tasks ?? []
      toTasks.push(task)
    },
    resetKanban() { return initialState },
  },
  extraReducers: (builder) => {
    // Global project reset
    builder.addCase('global/resetProjectState', () => initialState)

    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true
        state.boards = []
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false
        state.boards = Array.isArray(action.payload) ? action.payload : action.payload?.data ?? []
      })
      .addCase(fetchBoards.rejected, (state) => { state.loading = false })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload)
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter(b => b.id !== action.payload)
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        // Merge updated fields back into the board
        const updated = action.payload
        if (updated?.id) {
          const idx = state.boards.findIndex(b => b.id === updated.id)
          if (idx >= 0) state.boards[idx] = { ...state.boards[idx], ...updated }
        }
      })
      .addCase(setBoardColor.fulfilled, (state, action) => {
        const board = state.boards.find(b => b.id === action.payload.boardId)
        if (board) board.header_background = action.payload.color
      })
      .addCase(fetchBoardTasks.fulfilled, (state, action) => {
        const { boardId, tasks, meta } = action.payload
        const board = state.boards.find(b => b.id === boardId)
        if (board) {
          board.tasks = tasks
          board.tasksMeta = meta
        }
      })
      .addCase(loadMoreBoardTasks.fulfilled, (state, action) => {
        const { boardId, tasks, meta } = action.payload
        const board = state.boards.find(b => b.id === boardId)
        if (board) {
          const existing = Array.isArray(board.tasks) ? board.tasks : (board.tasks?.data ?? [])
          const newOnes = Array.isArray(tasks) ? tasks : []
          const ids = new Set(existing.map(t => t.id))
          const merged = existing.concat(newOnes.filter(t => !ids.has(t.id)))
          board.tasks = merged
          board.tasksMeta = meta
        }
      })
      .addCase(removeTaskFromBoard.fulfilled, (state, action) => {
        const { boardId, taskId } = action.payload
        const board = state.boards.find(b => b.id === boardId)
        if (board) {
          const tasks = Array.isArray(board.tasks) ? board.tasks : (board.tasks?.data ?? [])
          board.tasks = tasks.filter(t => t.id !== taskId)
        }
      })
      .addCase(addTaskToBoard.fulfilled, (state, action) => {
        // After adding, we reload all boards anyway, but update optimistically
      })

    // Sync task changes from TaskDetailSheet back into kanban boards in-place
    const syncTaskInBoards = (state, updatedTask, { preservePrivacy = false } = {}) => {
      if (!updatedTask?.id) return
      state.boards.forEach(board => {
        const tasks = Array.isArray(board.tasks) ? board.tasks : (board.tasks?.data ?? [])
        const idx = tasks.findIndex(t => t.id === updatedTask.id)
        if (idx !== -1) {
          const existing = tasks[idx]
          const mergedMeta = { ...existing.meta, ...updatedTask.meta }
          if (preservePrivacy) mergedMeta.privacy = existing.meta?.privacy
          tasks[idx] = { ...existing, ...updatedTask, meta: mergedMeta }
          if (!Array.isArray(board.tasks)) board.tasks = tasks
        }
      })
    }
    builder.addCase('tasks/updateTask/fulfilled', (state, action) => {
      if (action.payload) syncTaskInBoards(state, action.payload)
    })
    builder.addCase('tasks/fetchTask/fulfilled', (state, action) => {
      if (action.payload) syncTaskInBoards(state, action.payload, { preservePrivacy: true })
    })
    builder.addCase('tasks/changeTaskStatus/fulfilled', (state, action) => {
      if (!action.payload) return
      const { taskId, status } = action.payload
      state.boards.forEach(board => {
        const tasks = Array.isArray(board.tasks) ? board.tasks : (board.tasks?.data ?? [])
        const idx = tasks.findIndex(t => t.id === taskId)
        if (idx !== -1) {
          tasks[idx] = { ...tasks[idx], status }
          if (!Array.isArray(board.tasks)) board.tasks = tasks
        }
      })
    })
    builder.addCase('taskLists/updateTaskPrivacy', (state, action) => {
      const { taskId, privacy } = action.payload
      state.boards.forEach(board => {
        const tasks = Array.isArray(board.tasks) ? board.tasks : (board.tasks?.data ?? [])
        const task = tasks.find(t => t.id === taskId)
        if (task) task.meta = { ...task.meta, privacy }
      })
    })
    builder.addCase('tasks/deleteTask/fulfilled', (state, action) => {
      if (!action.payload) return
      const deletedId = action.payload
      state.boards.forEach(board => {
        const tasks = Array.isArray(board.tasks) ? board.tasks : (board.tasks?.data ?? [])
        board.tasks = tasks.filter(t => t.id !== deletedId)
      })
    })
    builder.addCase('tasks/addTaskComment/fulfilled', (state, action) => {
      if (!action.payload) return
      const taskId = action.meta?.arg?.taskId
      if (!taskId) return
      state.boards.forEach(board => {
        const tasks = Array.isArray(board.tasks) ? board.tasks : (board.tasks?.data ?? [])
        const idx = tasks.findIndex(t => t.id === taskId)
        if (idx !== -1) {
          const task = tasks[idx]
          const prev = parseInt(task.meta?.total_comment ?? task.comments_count ?? 0, 10) || 0
          tasks[idx] = { ...task, meta: { ...(task.meta || {}), total_comment: prev + 1 } }
          if (!Array.isArray(board.tasks)) board.tasks = tasks
        }
      })
    })
    builder.addCase('tasks/deleteTaskComment/fulfilled', (state, action) => {
      if (!action.payload) return
      const taskId = action.payload.taskId
      if (!taskId) return
      state.boards.forEach(board => {
        const tasks = Array.isArray(board.tasks) ? board.tasks : (board.tasks?.data ?? [])
        const idx = tasks.findIndex(t => t.id === taskId)
        if (idx !== -1) {
          const task = tasks[idx]
          const prev = parseInt(task.meta?.total_comment ?? task.comments_count ?? 0, 10) || 0
          tasks[idx] = { ...task, meta: { ...(task.meta || {}), total_comment: Math.max(0, prev - 1) } }
          if (!Array.isArray(board.tasks)) board.tasks = tasks
        }
      })
    })
  },
})

export const { setDragState, clearDragState, reorderBoardsLocal, moveTaskBetweenBoards, resetKanban } = kanbanSlice.actions
export default kanbanSlice.reducer
