import { useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  projectId: string
}

export default function Canvas3D({ projectId: _projectId }: Props) {
  const renderedImageUrl = useAppSelector((s) => s.render.renderedImageUrl)
  const [zoom, setZoom] = useState(1)

  if (!renderedImageUrl) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>No render available</p>
      </div>
    )
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = renderedImageUrl
    a.download = 'floor-plan-3d.png'
    a.click()
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-zinc-950">

      {/* ── Toolbar ── */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Button size="icon" variant="secondary" onClick={() => setZoom(z => Math.min(z + 0.25, 3))}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={() => setZoom(1)}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={handleDownload} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Download
        </Button>
      </div>

      {/* ── Rendered image ── */}
      <div className="flex h-full w-full items-center justify-center overflow-auto p-8">
        <img
          src={renderedImageUrl}
          alt="AI-generated 3D floor plan render"
          className={cn(
            'max-w-none rounded-xl shadow-2xl transition-transform duration-200 ease-out',
          )}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          draggable={false}
        />
      </div>
    </div>
  )
}
