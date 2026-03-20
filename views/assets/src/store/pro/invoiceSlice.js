import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useProApi } from '@hooks/useProApi'

const api = useProApi()

const initialState = {
  invoices: [],
  currentInvoice: null,
  pagination: null,
  loading: false,
  saving: false,
}

export const fetchInvoices = createAsyncThunk(
  'invoice/fetchInvoices',
  async ({ projectId, page = 1, per_page = 20 } = {}, { rejectWithValue }) => {
    try {
      const ep = projectId ? `projects/${projectId}/invoice` : 'invoices'
      const res = await api.get(ep, { per_page, page })
      return res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const fetchInvoice = createAsyncThunk(
  'invoice/fetchInvoice',
  async ({ projectId, invoiceId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`projects/${projectId}/invoice/${invoiceId}`)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const createInvoice = createAsyncThunk(
  'invoice/createInvoice',
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/invoice`, payload)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const updateInvoice = createAsyncThunk(
  'invoice/updateInvoice',
  async ({ projectId, invoiceId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/invoice/${invoiceId}`, payload)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const deleteInvoice = createAsyncThunk(
  'invoice/deleteInvoice',
  async ({ projectId, invoiceId }, { rejectWithValue }) => {
    try {
      await api.del(`projects/${projectId}/invoice/${invoiceId}`)
      return invoiceId
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const recordPayment = createAsyncThunk(
  'invoice/recordPayment',
  async ({ projectId, invoiceId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/invoice/${invoiceId}/payment`, payload)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const sendInvoiceEmail = createAsyncThunk(
  'invoice/sendEmail',
  async ({ projectId, invoiceId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`projects/${projectId}/invoice/${invoiceId}/mail`)
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setCurrentInvoice(state, action) { state.currentInvoice = action.payload },
    resetInvoices() { return initialState },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => { state.loading = true })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false
        state.invoices = action.payload?.data ?? []
        state.pagination = action.payload?.meta ?? null
      })
      .addCase(fetchInvoices.rejected, (state) => { state.loading = false })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.currentInvoice = action.payload
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload)
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(i => i.id !== action.payload)
      })
  },
})

export const { setCurrentInvoice, resetInvoices } = invoiceSlice.actions
export default invoiceSlice.reducer
