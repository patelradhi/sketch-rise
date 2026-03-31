import { useState } from 'react'
import { Copy, Check, Link } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'

interface Props {
  open: boolean
  onClose: () => void
  projectId: string
}

export default function ShareModal({ open, onClose, projectId }: Props) {
  const [shareUrl, setShareUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateLink = async () => {
    setLoading(true)
    try {
      const { data } = await api.post<{ shareUrl: string }>(`/api/projects/${projectId}/share`)
      setShareUrl(data.shareUrl)
    } catch {
      toast.error('Failed to generate share link')
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-4 w-4 text-primary" />
            Share Project
          </DialogTitle>
          <DialogDescription>
            Anyone with this link can view your 3D floor plan without signing in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!shareUrl ? (
            <Button onClick={generateLink} disabled={loading} className="w-full">
              {loading ? 'Generating…' : 'Generate Share Link'}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="text-xs" />
              <Button size="icon" variant="outline" onClick={copy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
