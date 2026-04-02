import { useAppSelector } from '@/store/hooks'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  projectId: string
}

export default function Canvas3D({ projectId: _projectId }: Props) {
  const renderedImageUrl = useAppSelector((s) => s.render.renderedImageUrl)

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

      {/* ── Minimal toolbar — download only ── */}
      <div className="shrink-0 flex items-center justify-end px-4 py-2 border-b border-white/10">
        <Button size="sm" variant="secondary" onClick={handleDownload} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Download
        </Button>
      </div>

      {/* ── Scrollable image at natural size ── */}
      <div className="flex-1 overflow-auto">
        <img
          src={renderedImageUrl}
          alt="AI-generated 3D floor plan render"
          className="block mx-auto"
          draggable={false}
        />
      </div>
    </div>
  )
}
