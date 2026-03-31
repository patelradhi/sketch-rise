import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Project } from '@/lib/types'

interface ProjectState {
  list: Project[]
  current: Project | null
  loading: boolean
}

const initialState: ProjectState = {
  list: [],
  current: null,
  loading: false,
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.list = action.payload
    },
    addProject(state, action: PayloadAction<Project>) {
      state.list.unshift(action.payload)
    },
    setCurrent(state, action: PayloadAction<Project>) {
      state.current = action.payload
    },
    updateProjectTitle(state, action: PayloadAction<{ id: string; title: string }>) {
      const p = state.list.find((p) => p._id === action.payload.id)
      if (p) p.title = action.payload.title
      if (state.current?._id === action.payload.id) state.current.title = action.payload.title
    },
    updateProjectThumbnail(state, action: PayloadAction<{ id: string; thumbnailBase64: string }>) {
      const p = state.list.find((p) => p._id === action.payload.id)
      if (p) p.thumbnailBase64 = action.payload.thumbnailBase64
    },
    removeProject(state, action: PayloadAction<string>) {
      state.list = state.list.filter((p) => p._id !== action.payload)
    },
    setProjectsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
})

export const {
  setProjects,
  addProject,
  setCurrent,
  updateProjectTitle,
  updateProjectThumbnail,
  removeProject,
  setProjectsLoading,
} = projectSlice.actions
export default projectSlice.reducer
