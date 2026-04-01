import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { setRenderData } from '@/store/slices/renderSlice'
import { setCurrent } from '@/store/slices/projectSlice'
import Canvas3D from '@/components/editor/Canvas3D'
import LoadingSkeleton from '@/components/editor/LoadingSkeleton'
import type { Project } from '@/lib/types'

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export default function SharedView() {
  const { token } = useParams<{ token: string }>()
  const dispatch = useAppDispatch()
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/v1/share/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json() as Promise<{ data: { project: Project } }>
      })
      .then(({ data }) => {
        setProject(data.project)
        dispatch(setCurrent(data.project))
        dispatch(setRenderData(data.project.renderData))
      })
      .catch(() => setError(true))
  }, [token, dispatch])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">🔗</span>
        <p className="text-muted-foreground">This share link is invalid or has expired.</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-background flex flex-col">
      <header className="glass border-b border-border flex items-center h-12 px-4 gap-3 shrink-0">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20">
          <Box className="h-3 w-3 text-primary" />
        </div>
        <span className="text-sm font-semibold">
          Sketch<span className="text-primary">Rise</span>
        </span>
        {project && (
          <>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-sm text-muted-foreground">{project.title}</span>
          </>
        )}
        <div className="ml-auto text-xs text-muted-foreground">Read-only shared view</div>
      </header>
      <main className="flex-1 relative">
        {!project ? <LoadingSkeleton /> : <Canvas3D projectId={project._id} />}
      </main>
    </div>
  )
}
