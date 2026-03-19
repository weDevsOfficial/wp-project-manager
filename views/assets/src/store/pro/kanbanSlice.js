import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useProApi } from '@hooks/useProApi'

const api = useProApi()

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
      const res = await api.post(`projects/${projectId}/kanboard`, { title })
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
  async ({ projectId, boardId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`projects/${projectId}/kanboard/${boardId}`)
      return { boardId, tasks: res.data ?? res }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const importTasks = createAsyncThunk(
  'kanban/importTasks',
  async ({ projectId, taskIds, boardId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/kanboard/import-tasks`, { task_ids: taskIds, board_id: boardId })
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
    resetKanban() { return initialState },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => { state.loading = true })
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
        const { boardId, tasks } = action.payload
        const board = state.boards.find(b => b.id === boardId)
        if (board) {
          // tasks might be { data: [...], meta: {...} } or just an array
          board.tasks = tasks
        }
      })
  },
})

export const { setDragState, clearDragState, resetKanban } = kanbanSlice.actions
export default kanbanSlice.reducer
