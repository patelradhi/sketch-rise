import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RenderData } from '@/lib/types'

export type RenderStatus = 'idle' | 'compressing' | 'analyzing' | 'saving' | 'success' | 'error'

interface RenderState {
  data: RenderData | null
  status: RenderStatus
  projectId: string | null
  error: string | null
  uploadProgress: number
}

const initialState: RenderState = {
  data: null,
  status: 'idle',
  projectId: null,
  error: null,
  uploadProgress: 0,
}

const renderSlice = createSlice({
  name: 'render',
  initialState,
  reducers: {
    setRenderData(state, action: PayloadAction<RenderData>) {
      state.data = action.payload
      state.status = 'success'
      state.error = null
    },
    setStatus(state, action: PayloadAction<RenderStatus>) {
      state.status = action.payload
      if (action.payload !== 'error') state.error = null
    },
    setProjectId(state, action: PayloadAction<string>) {
      state.projectId = action.payload
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.status = 'error'
    },
    setUploadProgress(state, action: PayloadAction<number>) {
      state.uploadProgress = action.payload
    },
    // Keep backward compat
    setLoading(state, action: PayloadAction<boolean>) {
      state.status = action.payload ? 'analyzing' : state.status
    },
    clearRender(state) {
      state.data = null
      state.status = 'idle'
      state.projectId = null
      state.error = null
      state.uploadProgress = 0
    },
  },
})

export const {
  setRenderData,
  setStatus,
  setProjectId,
  setError,
  setUploadProgress,
  setLoading,
  clearRender,
} = renderSlice.actions
export default renderSlice.reducer
