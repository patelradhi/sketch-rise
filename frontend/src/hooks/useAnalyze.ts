import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { compressImageToBase64 } from '@/lib/compressImage'
import { analyzeFloorPlanWithPuter } from '@/lib/puterAI'
import { setRenderData, setStatus, setProjectId, setError } from '@/store/slices/renderSlice'
import { addProject } from '@/store/slices/projectSlice'
import api from '@/lib/api'
import type { RenderStatus } from '@/store/slices/renderSlice'

export function useAnalyze() {
  const [localStatus, setLocalStatus] = useState<RenderStatus>('idle')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const analyze = useCallback(async (file: File) => {
    // Immediately mark as busy so the UI locks (prevents double uploads)
    setLocalStatus('compressing')
    dispatch(setStatus('compressing'))

    const toastId = toast.loading('Preparing your floor plan…')

    try {
      setLocalStatus('compressing')
      dispatch(setStatus('compressing'))

      // Step 1 — Compress image in browser (replaces Sharp on backend)
      const { base64 } = await compressImageToBase64(file)
      toast.loading('Claude AI is analyzing your floor plan…', { id: toastId })

      // Step 2 — Call Claude FREE via Puter.js (no API key, no cost!)
      setLocalStatus('analyzing')
      dispatch(setStatus('analyzing'))
      const renderData = await analyzeFloorPlanWithPuter(base64)

      // Step 3 — Update Redux immediately so 3D renders right away
      dispatch(setRenderData(renderData))
      toast.loading('Saving your project…', { id: toastId })

      // Step 4 — Save to MongoDB via backend
      setLocalStatus('saving')
      dispatch(setStatus('saving'))
      const { data } = await api.post('/api/v1/projects', {
        title: 'Untitled Project',
        renderData,
        originalSketchBase64: base64,
      })

      const project = data.data.project
      dispatch(setProjectId(project._id))
      dispatch(addProject(project))

      toast.success('3D model ready!', { id: toastId })
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
