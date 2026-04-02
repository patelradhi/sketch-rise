import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { compressImageToBase64 } from '@/lib/compressImage'
import { generateFloorPlan3D } from '@/lib/puterAI'
import { setRenderedImage, setStatus, setProjectId, setError } from '@/store/slices/renderSlice'
import { addProject } from '@/store/slices/projectSlice'
import api from '@/lib/api'
import type { RenderStatus } from '@/store/slices/renderSlice'

export function useAnalyze() {
  const [localStatus, setLocalStatus] = useState<RenderStatus>('idle')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const analyze = useCallback(async (file: File) => {
    // Immediately mark busy to lock the UI and prevent double uploads
    setLocalStatus('compressing')
    dispatch(setStatus('compressing'))

    const toastId = toast.loading('Preparing your floor plan…')

    try {
      // Step 1 — Compress image in browser
      const { base64, mimeType } = await compressImageToBase64(file)

      // Step 2 — Generate photorealistic 3D render via Puter AI (txt2img)
      setLocalStatus('analyzing')
      dispatch(setStatus('analyzing'))
      toast.loading('Generating your 3D render… (this takes ~30s)', { id: toastId })

      const renderedImageUrl = await generateFloorPlan3D(base64, mimeType)

      // Step 3 — Update Redux so editor shows the image immediately
      dispatch(setRenderedImage({ imageUrl: renderedImageUrl, sketchBase64: base64 }))

      // Step 4 — Save to MongoDB
      setLocalStatus('saving')
      dispatch(setStatus('saving'))
      toast.loading('Saving your project…', { id: toastId })

      const { data } = await api.post('/api/v1/projects', {
        title: 'Untitled Project',
        renderedImageUrl,
        originalSketchBase64: base64,
      })

      const project = data.data.project
      dispatch(setProjectId(project._id))
      dispatch(addProject(project))

      toast.success('3D render ready!', { id: toastId })
      setLocalStatus('success')
      navigate(`/editor/${project._id}`)

    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      // Give a friendlier message for the Puter auth case
      const message = raw.includes('connect your Puter')
        ? 'Please click "Connect" above to link your free Puter account first.'
        : raw
      dispatch(setError(message))
      setLocalStatus('error')
      toast.error(message, { id: toastId })
    }
  }, [dispatch, navigate])

  return { analyze, status: localStatus }
}
