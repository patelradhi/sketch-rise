import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { compressImageToBase64 } from '@/lib/compressImage'
import { setRenderedImage, setStatus, setProjectId, setError } from '@/store/slices/renderSlice'
import { addProject } from '@/store/slices/projectSlice'
import api from '@/lib/api'
import type { RenderStatus } from '@/store/slices/renderSlice'

export function useAnalyze() {
  const [localStatus, setLocalStatus] = useState<RenderStatus>('idle')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const analyze = useCallback(async (file: File) => {
    setLocalStatus('compressing')
    dispatch(setStatus('compressing'))

    const toastId = toast.loading('Preparing your floor plan…')

    try {
      // Step 1 — Compress image in browser
      const { base64, mimeType } = await compressImageToBase64(file)

      // Step 2 — Generate 3D render via backend Gemini API
      setLocalStatus('analyzing')
      dispatch(setStatus('analyzing'))
      toast.loading('Generating your 3D render… (this takes ~30s)', { id: toastId })

      const { data } = await api.post('/api/v1/generate', { base64Image: base64, mimeType })
      const renderedImageUrl = data.data.imageUrl

      // Step 3 — Update Redux so editor shows the image immediately
      dispatch(setRenderedImage({ imageUrl: renderedImageUrl, sketchBase64: base64 }))

      // Step 4 — Save to MongoDB
      setLocalStatus('saving')
      dispatch(setStatus('saving'))
      toast.loading('Saving your project…', { id: toastId })

      const { data: saveData } = await api.post('/api/v1/projects', {
        title: 'Untitled Project',
        renderedImageUrl,
        originalSketchBase64: base64,
      })

      const project = saveData.data.project
      dispatch(setProjectId(project._id))
      dispatch(addProject(project))

      toast.success('3D render ready!', { id: toastId })
      setLocalStatus('success')
      navigate(`/editor/${project._id}`)

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      dispatch(setError(message))
      setLocalStatus('error')
      toast.error(message, { id: toastId })
    }
  }, [dispatch, navigate])

  return { analyze, status: localStatus }
}
