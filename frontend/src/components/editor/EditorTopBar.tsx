import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Share2, X, Box, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateProjectTitle } from '@/store/slices/projectSlice'
import ShareModal from '@/components/shared/ShareModal'
import ExportModal from '@/components/shared/ExportModal'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function EditorTopBar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const project = useAppSelector((s) => s.project.current)
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState(project?.title ?? 'Untitled Project')
  const [saving, setSaving] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  const saveTitle = async () => {
    setEditingTitle(false)
    if (!project || title === project.title) return
    setSaving(true)
    try {
      await api.patch(`/api/projects/${project._id}`, { title })
      dispatch(updateProjectTitle({ id: project._id, title }))
    } catch {
      toast.error('Failed to save title')
    } finally {
      setSaving(false)
    }
  }

  return (
    <TooltipProvider>
      <header className="fixed top-0 z-40 w-full glass border-b border-border flex items-center h-14 px-4 gap-4">
        {/* Left: Logo + Exit */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
            <Box className="h-3.5 w-3.5 text-primary" />
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => navigate('/')}>
            <X className="h-4 w-4" />
            EXIT EDITOR
          </Button>
        </div>

        {/* Center: Project info */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Project</p>
          {editingTitle ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
              className="h-6 text-sm text-center border-0 border-b rounded-none px-1 bg-transparent focus-visible:ring-0 w-48"
              autoFocus
            />
          ) : (
            <button
              className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1"
              onDoubleClick={() => setEditingTitle(true)}
            >
              {title}
              {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            </button>
          )}
          <p className="text-[10px] text-muted-foreground">Created by you</p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setExportOpen(true)}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">EXPORT</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save render as PNG</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setShareOpen(true)}>
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">SHARE</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate public link</TooltipContent>
          </Tooltip>

          {project && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground ml-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              Saved
            </div>
          )}
        </div>
      </header>

      {project && (
        <>
          <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} projectId={project._id} />
          <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} projectTitle={title} />
        </>
      )}
    </TooltipProvider>
  )
}
