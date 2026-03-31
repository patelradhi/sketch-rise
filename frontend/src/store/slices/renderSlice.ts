import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RenderData } from '@/lib/types'

interface RenderState {
  data: RenderData | null
  loading: boolean
  error: string | null
  uploadProgress: number
}

const initialState: RenderState = {
  data: null,
  loading: false,
  error: null,
  uploadProgress: 0,
}

const renderSlice = createSlice({
  name: 'render',
  initialState,
  reducers: {
    setRenderData(state, action: PayloadAction<RenderData>) {
      state.data = action.payload
      state.loading = false
      state.error = null
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
      if (action.payload) state.error = null
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
    setUploadProgress(state, action: PayloadAction<number>) {
      state.uploadProgress = action.payload
    },
    clearRender(state) {
      state.data = null
      state.loading = false
      state.error = null
      state.uploadProgress = 0
    },
  },
})

export const { setRenderData, setLoading, setError, setUploadProgress, clearRender } = renderSlice.actions
export default renderSlice.reducer
