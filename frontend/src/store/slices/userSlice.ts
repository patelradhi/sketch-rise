import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserProfile } from '@/lib/types'

interface UserState {
  profile: UserProfile | null
}

const initialState: UserState = { profile: null }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload
    },
    incrementGenerations(state) {
      if (state.profile) state.profile.generationsUsed += 1
    },
    clearUser(state) {
      state.profile = null
    },
  },
})

export const { setUserProfile, incrementGenerations, clearUser } = userSlice.actions
export default userSlice.reducer
