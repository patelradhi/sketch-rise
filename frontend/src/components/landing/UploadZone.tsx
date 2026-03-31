import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Upload, ImageIcon, Loader2 } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { setRenderData, setLoading, setError, setUploadProgress } from '@/store/slices/renderSlice'
import { addProject } from '@/store/slices/projectSlice'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/constants'
import api from '@/lib/api'
import type { AnalyzeResponse } from '@/lib/types'

export default function UploadZone() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0]
      if (!file) return

      setUploading(true)
      setProgress(0)
      dispatch(setLoading(true))

      const formData = new FormData()
      formData.append('sketch', file)

      const toastId = toast.loading('Analyzing your floor plan with Gemini AI…')

      try {
        const { data } = await api.post<AnalyzeResponse>('/api/analyze', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded / (e.total ?? 1)) * 60)
            setProgress(pct)
            dispatch(setUploadProgress(pct))
          },
        })

        setProgress(100)
        dispatch(setRenderData(data.renderData))
        dispatch(addProject(data.project))
        toast.success('3D model ready!', { id: toastId })
        navigate(`/editor/${data.project._id}`)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.'
        dispatch(setError(msg))
        toast.error(msg, { id: toastId })
      } finally {
        setUploading(false)
      }
    },
    [dispatch, navigate],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxSize: MAX_UPLOAD_BYTES,
    maxFiles: 1,
    disabled: uploading,
  })

  const rejection = fileRejections[0]?.errors[0]

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div
        {...getRootProps()}
        className={cn(
          'relative grid-bg rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/50 hover:bg-secondary/30',
          uploading && 'pointer-events-none opacity-70',
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl border transition-colors',
              isDragActive ? 'border-primary bg-primary/20' : 'border-border bg-secondary',
            )}
          >
            {uploading ? (
              <Loader2 className="h-7 w-7 text-primary animate-spin" />
            ) : isDragActive ? (
              <ImageIcon className="h-7 w-7 text-primary" />
            ) : (
              <Upload className="h-7 w-7 text-muted-foreground" />
            )}
          </div>

          {uploading ? (
            <div className="w-full max-w-xs space-y-2">
              <p className="text-sm font-medium text-foreground">Processing with Gemini AI…</p>
              <Progress value={progress} className="h-1.5" />
              <p className="text-xs text-muted-foreground">{progress}%</p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {isDragActive ? 'Drop your floor plan here' : 'Upload your floor plan'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Drag & drop or click — PNG or JPG, max 10 MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {rejection && (
        <p className="mt-2 text-center text-xs text-destructive">{rejection.message}</p>
      )}
    </div>
  )
}
