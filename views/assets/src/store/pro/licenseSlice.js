import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useProApi } from '@hooks/useProApi'

const api = useProApi()

const initialState = {
  license: null,
  loading: false,
}

export const checkLicense = createAsyncThunk(
  'license/check',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('license/check')
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const activateLicense = createAsyncThunk(
  'license/activate',
  async ({ key }, { rejectWithValue }) => {
    try {
      const res = await api.post('license/activation', { key })
      return res.data ?? res
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

export const deleteLicense = createAsyncThunk(
  'license/delete',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('license/delete')
      return null
    } catch (e) {
      return rejectWithValue(e.message)
    }
  },
)

const licenseSlice = createSlice({
  name: 'license',
  initialState,
  reducers: {
    resetLicense() { return initialState },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkLicense.pending, (state) => { state.loading = true })
      .addCase(checkLicense.fulfilled, (state, action) => {
        state.loading = false
        state.license = action.payload
      })
      .addCase(checkLicense.rejected, (state) => { state.loading = false })
      .addCase(activateLicense.fulfilled, (state, action) => {
        state.license = action.payload
      })
      .addCase(deleteLicense.fulfilled, (state) => {
        state.license = null
      })
  },
})

export const { resetLicense } = licenseSlice.actions
export default licenseSlice.reducer
