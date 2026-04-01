import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, ImageIcon, Loader2, Sparkles } from 'lucide-react'
import { useAnalyze } from '@/hooks/useAnalyze'
import { useAppSelector } from '@/store/hooks'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/constants'

const STATUS_LABELS: Record<string, string> = {
  compressing: 'Connecting to Puter AI — sign in if a popup appears…',
  analyzing:   'Claude AI is reading your floor plan…',
  saving:      'Saving your project…',
  error:       'Something went wrong — try again',
}

const STATUS_PROGRESS: Record<string, number> = {
  compressing: 15,
  analyzing:   60,
  saving:      90,
  success:     100,
}

export default function UploadZone() {
  const { analyze, status } = useAnalyze()
  const renderStatus = useAppSelector((s) => s.render.status)
  const busy = ['compressing', 'analyzing', 'saving'].includes(status)

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0]
      if (file) analyze(file)
    },
    [analyze],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxSize: MAX_UPLOAD_BYTES,
    maxFiles: 1,
    disabled: busy,
  })

  const rejection = fileRejections[0]?.errors[0]
  const progress = STATUS_PROGRESS[status] ?? 0
  const label = STATUS_LABELS[status] ?? 'Upload your floor plan'

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div
        {...getRootProps()}
        className={cn(
          'relative grid-bg rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200',
          isDragActive ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/50 hover:bg-secondary/30',
          busy && 'pointer-events-none opacity-80',
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl border transition-colors',
            isDragActive ? 'border-primary bg-primary/20' : 'border-border bg-secondary',
          )}>
            {busy ? (
              <Loader2 className="h-7 w-7 text-primary animate-spin" />
            ) : isDragActive ? (
              <ImageIcon className="h-7 w-7 text-primary" />
            ) : (
              <Upload className="h-7 w-7 text-muted-foreground" />
            )}
          </div>

          {/* Status text */}
          {busy ? (
            <div className="w-full max-w-xs space-y-2">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <Progress value={progress} className="h-1.5" />
              <p className="text-xs text-muted-foreground">{progress}%</p>
            </div>
          ) : (
            <div>
              <p className="text-base font-semibold text-foreground">
                {isDragActive ? 'Drop your floor plan here' : 'Upload your floor plan'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag & drop or click — PNG or JPG, max 10 MB
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary/80">
                <Sparkles className="h-3 w-3" />
                Powered by Claude AI via Puter.js — completely free
              </div>
            </div>
          )}
        </div>
      </div>

      {rejection && (
        <p className="mt-2 text-center text-xs text-destructive">{rejection.message}</p>
      )}
    </div>
  )
}
