import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { compressImageToBase64 } from '@/lib/compressImage'
import { setRenderedImage, setStatus, setProjectId, setError } from '@/store/slices/renderSlice'
import { addProject } from '@/store/slices/projectSlice'
import { incrementGenerations } from '@/store/slices/userSlice'
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
      const { originalSketchUrl, renderedImageUrl } = data.data

      // Step 3 — Update Redux so editor shows the image immediately
      dispatch(setRenderedImage({ imageUrl: renderedImageUrl, sketchUrl: originalSketchUrl }))

      // Step 4 — Save to MongoDB
      setLocalStatus('saving')
      dispatch(setStatus('saving'))
      toast.loading('Saving your project…', { id: toastId })

      const { data: saveData } = await api.post('/api/v1/projects', {
        title: 'Untitled Project',
        renderedImageUrl,
        originalSketchUrl,
      })

      const project = saveData.data.project
      dispatch(setProjectId(project._id))
      dispatch(addProject(project))
      dispatch(incrementGenerations())

      toast.success('3D render ready!', { id: toastId })
      setLocalStatus('success')
      navigate(`/editor/${project._id}`)

    } catch (err: unknown) {
      const apiError = axios.isAxiosError(err) ? err.response?.data?.error : undefined
      const code: string | undefined = apiError?.code
      const apiMessage: string | undefined = apiError?.message

      if (code === 'LIMIT_REACHED') {
        const message = apiMessage ?? "You've reached your free generation limit."
        dispatch(setError(message))
        setLocalStatus('error')
        toast.error(message, {
          id: toastId,
          duration: 8000,
          action: { label: 'Upgrade', onClick: () => navigate('/pricing') },
        })
        return
      }

      if (code === 'AI_RATE_LIMITED') {
        const message = apiMessage ?? 'Our AI service is busy. Please try again shortly.'
        dispatch(setError(message))
        setLocalStatus('error')
        toast.error(message, { id: toastId, duration: 6000 })
        return
      }

      const fallback = apiMessage ?? (err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      dispatch(setError(fallback))
      setLocalStatus('error')
      toast.error(fallback, { id: toastId })
    }
  }, [dispatch, navigate])

  return { analyze, status: localStatus }
}
