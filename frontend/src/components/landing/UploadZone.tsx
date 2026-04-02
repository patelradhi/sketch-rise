import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, ImageIcon, Loader2, Sparkles, LogIn, CheckCircle2, Loader } from 'lucide-react'
import { useAnalyze } from '@/hooks/useAnalyze'
import { usePuterAuth } from '@/hooks/usePuterAuth'
import { useAppSelector } from '@/store/hooks'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/constants'

const STATUS_LABELS: Record<string, string> = {
  compressing: 'Preparing image…',
  analyzing:   'Claude AI is reading your floor plan…',
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
  const { state: puterState, signIn } = usePuterAuth()
  useAppSelector((s) => s.render.status) // keep Redux in sync
  const busy = ['compressing', 'analyzing', 'saving'].includes(status)
  const isSignedIn = puterState === 'signed-in'

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
    disabled: busy || !isSignedIn,
  })

  const rejection = fileRejections[0]?.errors[0]
  const progress = STATUS_PROGRESS[status] ?? 0
  const label = STATUS_LABELS[status] ?? 'Upload your floor plan'

  return (
    <div className="w-full max-w-2xl mx-auto px-4 space-y-3">

      {/* ── Step 1: Connect Puter (must do before upload) ── */}
      <div className={cn(
        'flex items-center justify-between rounded-xl border px-4 py-3 transition-colors',
        isSignedIn
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-primary/40 bg-primary/5',
      )}>
        <div className="flex items-center gap-2 text-sm">
          {puterState === 'loading' ? (
            <>
              <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Loading Puter AI…</span>
            </>
          ) : isSignedIn ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-medium">Puter AI connected</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Step 1 — Connect Puter AI (free)</span>
            </>
          )}
        </div>

        {!isSignedIn && puterState !== 'loading' && (
          <Button size="sm" onClick={signIn} className="gap-1.5 text-xs">
            <LogIn className="h-3 w-3" />
            Connect
          </Button>
        )}
      </div>

      {/* ── Step 2: Upload zone ── */}
      <div
        {...getRootProps()}
        className={cn(
          'relative grid-bg rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200',
          isSignedIn && !busy
            ? 'cursor-pointer hover:border-primary/50 hover:bg-secondary/30'
            : 'cursor-not-allowed opacity-50',
          isDragActive && isSignedIn ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border',
          busy && 'pointer-events-none opacity-80',
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl border transition-colors',
            isDragActive && isSignedIn ? 'border-primary bg-primary/20' : 'border-border bg-secondary',
          )}>
            {busy ? (
              <Loader2 className="h-7 w-7 text-primary animate-spin" />
            ) : isDragActive && isSignedIn ? (
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
                {!isSignedIn
                  ? 'Connect Puter AI above to enable upload'
                  : isDragActive
                    ? 'Drop your floor plan here'
                    : 'Step 2 — Upload your floor plan'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {isSignedIn
                  ? 'Drag & drop or click — PNG or JPG, max 10 MB'
                  : 'Sign in with your free Puter account to continue'}
              </p>
              {isSignedIn && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary/80">
                  <Sparkles className="h-3 w-3" />
                  Powered by Claude AI via Puter.js — completely free
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {rejection && (
        <p className="text-center text-xs text-destructive">{rejection.message}</p>
      )}
    </div>
  )
}
