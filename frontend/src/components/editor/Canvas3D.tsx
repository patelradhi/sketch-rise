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
    <div className="flex flex-col w-full h-full bg-zinc-950">

      {/* ── Toolbar ── */}
      <div className="shrink-0 flex items-center justify-end gap-2 px-4 py-2 border-b border-white/10">
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

      {/* ── Scroll area — flex-1 so it fills remaining height exactly ── */}
      <div className="flex-1 overflow-auto p-6">
        <img
          src={renderedImageUrl}
          alt="AI-generated 3D floor plan render"
          className="mx-auto block rounded-xl shadow-2xl"
          style={{ width: `${zoom * 100}%`, maxWidth: 'none' }}
          draggable={false}
        />
      </div>
    </div>
  )
}
