import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import api from '@/lib/api'

export function useShare(projectId: string) {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generate = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.post<{ shareUrl: string }>(`/api/projects/${projectId}/share`)
      setShareUrl(data.shareUrl)
      return data.shareUrl
    } catch {
      toast.error('Failed to generate share link')
      return null
    } finally {
      setLoading(false)
    }
  }, [projectId])

  const copy = useCallback(() => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    toast.success('Copied to clipboard')
  }, [shareUrl])

  return { shareUrl, loading, generate, copy }
}
