import { Download } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onClose: () => void
  projectTitle: string
}

export default function ExportModal({ open, onClose, projectTitle }: Props) {
  const exportAs = (format: 'png' | 'jpeg') => {
    const canvas = document.querySelector('canvas')
    if (!canvas) {
      toast.error('Canvas not ready')
      return
    }
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
    const dataURL = canvas.toDataURL(mimeType, 1.0)
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `${projectTitle.replace(/\s+/g, '_')}.${format}`
    a.click()
    toast.success(`Exported as ${format.toUpperCase()}`)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            Export Render
          </DialogTitle>
          <DialogDescription>
            Save your 3D visualization as an image file.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => exportAs('png')}>
            <span className="text-2xl">🖼️</span>
            <span className="text-sm font-semibold">PNG</span>
            <span className="text-xs text-muted-foreground">Lossless</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => exportAs('jpeg')}>
            <span className="text-2xl">📷</span>
            <span className="text-sm font-semibold">JPEG</span>
            <span className="text-xs text-muted-foreground">Compressed</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
