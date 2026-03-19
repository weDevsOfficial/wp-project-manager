import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useProApi } from '@hooks/useProApi'

const api = useProApi()

const initialState = {
  subtasks: [],
  loading: false,
  saving: false,
}

export const fetchSubtasks = createAsyncThunk(
  'subtasks/fetchSubtasks',
  async ({ taskId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`tasks/${taskId}/sub-tasks`)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Vue sends: title, description, parent_id, task_id, project_id,
//            board_id, assignees, start_at, due_date, estimation,
//            task_privacy, type_id
export const createSubtask = createAsyncThunk(
  'subtasks/createSubtask',
  async ({ taskId, projectId, boardId, payload }, { rejectWithValue }) => {
    try {
      const body = {
        title: payload.title || '',
        description: payload.description || '',
        parent_id: taskId,
        task_id: taskId,
        project_id: projectId,
        board_id: boardId || '',
        assignees: payload.assignees || '',
        start_at: payload.start_at || '',
        due_date: payload.due_date || '',
        estimation: payload.estimation || 0,
        task_privacy: false,
        type_id: payload.type_id || '',
      }
      const res = await api.post(`tasks/${taskId}/sub-tasks`, body)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

// Vue update sends same fields as create + sub_task_id
export const updateSubtask = createAsyncThunk(
  'subtasks/updateSubtask',
  async ({ taskId, subtaskId, projectId, boardId, payload }, { rejectWithValue }) => {
    try {
      const body = {
        sub_task_id: subtaskId,
        task_id: taskId,
        project_id: projectId || '',
        board_id: boardId || '',
        ...payload,
      }
      const res = await api.post(`tasks/${taskId}/sub-tasks/${subtaskId}/update`, body)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const deleteSubtask = createAsyncThunk(
  'subtasks/deleteSubtask',
  async ({ taskId, subtaskId }, { rejectWithValue }) => {
    try {
      await api.post(`tasks/${taskId}/sub-tasks/${subtaskId}/delete`)
      return subtaskId
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const promoteSubtaskToTask = createAsyncThunk(
  'subtasks/promoteToTask',
  async ({ taskId, subtaskId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`tasks/${taskId}/sub-tasks/${subtaskId}/make-task`)
      return { subtaskId, newTask: res.data ?? res }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const reorderSubtasks = createAsyncThunk(
  'subtasks/reorder',
  async ({ orders }, { rejectWithValue }) => {
    try {
      await api.post('sub-tasks/sorting', { orders })
      return orders
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const subtasksSlice = createSlice({
  name: 'subtasks',
  initialState,
  reducers: {
    resetSubtasks() { return initialState },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubtasks.pending, (state) => { state.loading = true })
      .addCase(fetchSubtasks.fulfilled, (state, action) => {
        state.loading = false
        state.subtasks = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchSubtasks.rejected, (state) => { state.loading = false })
      .addCase(createSubtask.pending, (state) => { state.saving = true })
      .addCase(createSubtask.fulfilled, (state, action) => {
        state.saving = false
        if (action.payload?.id) {
          state.subtasks.push(action.payload)
        }
      })
      .addCase(createSubtask.rejected, (state) => { state.saving = false })
      .addCase(updateSubtask.fulfilled, (state, action) => {
        const idx = state.subtasks.findIndex(s => s.id === action.payload?.id)
        if (idx >= 0) state.subtasks[idx] = action.payload
      })
      .addCase(deleteSubtask.fulfilled, (state, action) => {
        state.subtasks = state.subtasks.filter(s => s.id !== action.payload)
      })
      .addCase(promoteSubtaskToTask.fulfilled, (state, action) => {
        state.subtasks = state.subtasks.filter(s => s.id !== action.payload.subtaskId)
      })
  },
})

export const { resetSubtasks } = subtasksSlice.actions
export default subtasksSlice.reducer
