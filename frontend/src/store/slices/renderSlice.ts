import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type RenderStatus = 'idle' | 'compressing' | 'analyzing' | 'saving' | 'success' | 'error'

interface RenderState {
  renderedImageUrl: string | null  // 3D render Cloudinary URL
  originalSketchUrl: string | null // 2D sketch Cloudinary URL
  status: RenderStatus
  projectId: string | null
  error: string | null
}

const initialState: RenderState = {
  renderedImageUrl: null,
  originalSketchUrl: null,
  status: 'idle',
  projectId: null,
  error: null,
}

const renderSlice = createSlice({
  name: 'render',
  initialState,
  reducers: {
    setRenderedImage(state, action: PayloadAction<{ imageUrl: string; sketchUrl: string }>) {
      state.renderedImageUrl = action.payload.imageUrl
      state.originalSketchUrl = action.payload.sketchUrl
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
      state.originalSketchUrl = null
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
