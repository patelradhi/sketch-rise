import { useCallback } from 'react'
import { toast } from 'sonner'
import { useAppDispatch } from '@/store/hooks'
import { updateProjectThumbnail } from '@/store/slices/projectSlice'
import api from '@/lib/api'

export function useProjectSave(projectId: string) {
  const dispatch = useAppDispatch()

  const saveThumbnail = useCallback(async () => {
    const canvas = document.querySelector('canvas')
    if (!canvas || !projectId) return
    const thumbnailBase64 = canvas.toDataURL('image/jpeg', 0.7)
    try {
      await api.patch(`/api/projects/${projectId}`, { thumbnailBase64 })
      dispatch(updateProjectThumbnail({ id: projectId, thumbnailBase64 }))
    } catch {
      // Silent fail — thumbnail is non-critical
    }
  }, [projectId, dispatch])

  const saveTitle = useCallback(
    async (title: string) => {
      try {
        await api.patch(`/api/projects/${projectId}`, { title })
        toast.success('Saved', { duration: 1500 })
      } catch {
        toast.error('Failed to save')
      }
    },
    [projectId],
  )

  return { saveThumbnail, saveTitle }
}
