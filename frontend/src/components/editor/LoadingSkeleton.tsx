import { Loader2, Brain } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useAppSelector } from '@/store/hooks'

export default function LoadingSkeleton() {
  const progress = useAppSelector((s) => s.render.uploadProgress)

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-10 gap-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-primary/20">
        <Brain className="h-10 w-10 text-primary animate-pulse" />
      </div>

      <div className="text-center space-y-1">
        <p className="text-lg font-semibold">Claude is analyzing your floor plan</p>
        <p className="text-sm text-muted-foreground">
          Detecting rooms, walls, doors, windows & furniture…
        </p>
      </div>

      <div className="w-64 space-y-2">
        <Progress value={progress || 40} className="h-1.5" />
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Building 3D geometry from JSON…
        </div>
      </div>
    </div>
  )
}
