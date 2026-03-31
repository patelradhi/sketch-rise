import { configureStore } from '@reduxjs/toolkit'
import renderReducer from './slices/renderSlice'
import projectReducer from './slices/projectSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    render: renderReducer,
    project: projectReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
