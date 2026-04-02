import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type RenderStatus = 'idle' | 'compressing' | 'analyzing' | 'saving' | 'success' | 'error'

interface RenderState {
  renderedImageUrl: string | null  // photorealistic image from Puter AI
  originalSketchBase64: string | null
  status: RenderStatus
  projectId: string | null
  error: string | null
}

const initialState: RenderState = {
  renderedImageUrl: null,
  originalSketchBase64: null,
  status: 'idle',
  projectId: null,
  error: null,
}

const renderSlice = createSlice({
  name: 'render',
  initialState,
  reducers: {
    setRenderedImage(state, action: PayloadAction<{ imageUrl: string; sketchBase64: string }>) {
      state.renderedImageUrl = action.payload.imageUrl
      state.originalSketchBase64 = action.payload.sketchBase64
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
    clearRender(state) {
      state.renderedImageUrl = null
      state.originalSketchBase64 = null
      state.status = 'idle'
      state.projectId = null
      state.error = null
    },
  },
})

export const {
  setRenderedImage,
  setStatus,
  setProjectId,
  setError,
  clearRender,
} = renderSlice.actions
export default renderSlice.reducer
