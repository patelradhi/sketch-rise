import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  shareModalOpen: boolean
  exportModalOpen: boolean
}

const initialState: UiState = {
  shareModalOpen: false,
  exportModalOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openShareModal(state) { state.shareModalOpen = true },
    closeShareModal(state) { state.shareModalOpen = false },
    openExportModal(state) { state.exportModalOpen = true },
    closeExportModal(state) { state.exportModalOpen = false },
  },
})

export const { openShareModal, closeShareModal, openExportModal, closeExportModal } = uiSlice.actions
export default uiSlice.reducer
