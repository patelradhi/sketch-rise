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
    <div className="p-6">
      {/* Download button */}
      <div className="flex justify-end mb-4">
        <Button size="sm" variant="secondary" onClick={handleDownload} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Download
        </Button>
      </div>

      {/* Image — max 900px wide, centered, natural height, page scrolls below */}
      <img
        src={renderedImageUrl}
        alt="AI-generated 3D floor plan render"
        className="block mx-auto rounded-xl shadow-2xl"
        style={{ maxWidth: '900px', width: '100%' }}
        draggable={false}
      />
    </div>
  )
}
