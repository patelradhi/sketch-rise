import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, ImageIcon, Loader2, Sparkles, Layers } from 'lucide-react'
import { useAnalyze } from '@/hooks/useAnalyze'
import { useAppSelector } from '@/store/hooks'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/constants'

const STATUS_LABELS: Record<string, string> = {
  compressing: 'Preparing image…',
  analyzing:   'Generating your 3D render… (~30s)',
  saving:      'Saving your project…',
  error:       'Something went wrong — try again',
}

const STATUS_PROGRESS: Record<string, number> = {
  compressing: 20,
  analyzing:   60,
  saving:      90,
  success:     100,
}

export default function UploadZone() {
  const { analyze, status } = useAnalyze()
  useAppSelector((s) => s.render.status)

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

  return (
    <section className="container mt-10 mb-4 flex justify-center">
      {/* Outer grid-bg wrapper */}
      <div className="relative grid-bg rounded-3xl border border-border/60 p-10 overflow-hidden w-full max-w-3xl">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[140px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Inner card */}
        <div className="relative rounded-2xl bg-card/80 backdrop-blur-sm border border-border/80 shadow-xl shadow-black/20 p-4 max-w-sm mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30 mb-2">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Upload your floor plan</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Supports JPG, PNG — max 10 MB</p>
          </div>

          {/* Inner dashed drop zone */}
          <div
            {...getRootProps()}
            className={cn(
              'relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 py-10 px-3 text-center',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-border/70 hover:border-primary/50 hover:bg-secondary/40',
              busy && 'pointer-events-none opacity-80',
            )}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
                isDragActive ? 'border-primary bg-primary/20' : 'border-border bg-secondary',
              )}>
                {busy ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : isDragActive ? (
                  <ImageIcon className="h-4 w-4 text-primary" />
                ) : (
                  <Upload className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {busy ? (
                <div className="w-full max-w-xs space-y-1.5 mt-1">
                  <p className="text-xs font-medium text-foreground">{STATUS_LABELS[status] ?? 'Uploading…'}</p>
                  <Progress value={progress} className="h-1" />
                  <p className="text-[10px] text-muted-foreground">{progress}%</p>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-foreground">
                    {isDragActive ? 'Drop your floor plan here' : 'Click to upload or drag and drop'}
                  </p>
                  <div className="inline-flex items-center gap-1 text-[10px] text-primary/80">
                    <Sparkles className="h-2.5 w-2.5" />
                    Powered by Gemini AI
                  </div>
                </>
              )}
            </div>
          </div>

          {rejection && (
            <p className="text-center text-xs text-destructive mt-3">{rejection.message}</p>
          )}
        </div>
      </div>
    </section>
  )
}
