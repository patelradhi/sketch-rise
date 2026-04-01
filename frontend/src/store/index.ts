import { configureStore } from '@reduxjs/toolkit'
import renderReducer from './slices/renderSlice'
import projectReducer from './slices/projectSlice'
import userReducer from './slices/userSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    render: renderReducer,
    project: projectReducer,
    user: userReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
