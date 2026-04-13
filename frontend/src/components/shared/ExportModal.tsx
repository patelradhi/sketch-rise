import { useState } from 'react'
import { Download, Image, FileImage } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  projectTitle: string
  imageUrl?: string
}

export default function ExportModal({ open, onClose, projectTitle, imageUrl }: Props) {
  const [exporting, setExporting] = useState(false)

  const exportAs = async (format: 'png' | 'jpeg') => {
    if (!imageUrl) {
      toast.error('No image available to export')
      return
    }

    setExporting(true)
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      // If user wants JPEG but source is PNG, convert via canvas
      if (format === 'jpeg') {
        const bitmap = await createImageBitmap(blob)
        const canvas = document.createElement('canvas')
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(bitmap, 0, 0)
        canvas.toBlob(
          (jpegBlob) => {
            if (jpegBlob) downloadBlob(jpegBlob, format)
          },
          'image/jpeg',
          0.92,
        )
      } else {
        downloadBlob(blob, format)
      }

      toast.success(`Exported as ${format.toUpperCase()}`)
      onClose()
    } catch {
      toast.error('Failed to export image')
    } finally {
      setExporting(false)
    }
  }

  const downloadBlob = (blob: Blob, format: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectTitle.replace(/\s+/g, '_')}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Render
          </DialogTitle>
          <DialogDescription>
            Save your 3D visualization as an image file.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            disabled={exporting}
            onClick={() => exportAs('png')}
            className={cn(
              'group flex flex-col items-center gap-2 rounded-lg border border-border bg-secondary/50 p-5',
              'hover:border-primary/50 hover:bg-primary/10 transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <Image className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-bold">PNG</span>
            <span className="text-[11px] text-muted-foreground">Lossless</span>
          </button>

          <button
            disabled={exporting}
            onClick={() => exportAs('jpeg')}
            className={cn(
              'group flex flex-col items-center gap-2 rounded-lg border border-border bg-secondary/50 p-5',
              'hover:border-primary/50 hover:bg-primary/10 transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <FileImage className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-bold">JPEG</span>
            <span className="text-[11px] text-muted-foreground">Compressed</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
