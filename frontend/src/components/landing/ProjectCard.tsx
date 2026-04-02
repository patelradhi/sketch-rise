import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { MoreHorizontal, Trash2, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/store/hooks'
import { updateProjectTitle, removeProject } from '@/store/slices/projectSlice'
import { formatDate } from '@/lib/utils'
import api from '@/lib/api'
import type { Project } from '@/lib/types'

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(project.title)

  const handleTitleSave = async () => {
    setEditing(false)
    if (title === project.title) return
    try {
      await api.patch(`/api/projects/${project._id}`, { title })
      dispatch(updateProjectTitle({ id: project._id, title }))
      toast.success('Project renamed')
    } catch {
      setTitle(project.title)
      toast.error('Failed to rename project')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/api/projects/${project._id}`)
      dispatch(removeProject(project._id))
      toast.success('Project deleted')
    } catch {
      toast.error('Failed to delete project')
    }
  }

  return (
    <Card className="group overflow-hidden hover:border-primary/30 transition-all duration-200 cursor-pointer">
      {/* Thumbnail */}
      <div
        className="relative h-40 bg-secondary overflow-hidden"
        onClick={() => navigate(`/editor/${project._id}`)}
      >
        {project.renderedImageUrl ? (
          <img
            src={project.renderedImageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="grid-bg w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-20">🏗️</span>
          </div>
        )}
        {project.isPublic && (
          <Badge className="absolute top-2 left-2 text-[10px]" variant="secondary">
            Community
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          {/* Inline editable title */}
          {editing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              className="h-7 text-sm px-1"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p
              className="text-sm font-semibold truncate flex-1 hover:text-primary cursor-text"
              onDoubleClick={(e) => { e.stopPropagation(); setEditing(true) }}
              onClick={() => navigate(`/editor/${project._id}`)}
            >
              {project.title}
            </p>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/editor/${project._id}`)}>
                <ExternalLink className="h-4 w-4" /> Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditing(true)}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {formatDate(project.createdAt)}
        </p>
      </CardContent>
    </Card>
  )
}
