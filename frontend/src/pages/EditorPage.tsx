import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCurrent } from '@/store/slices/projectSlice'
import { setRenderedImage, setStatus } from '@/store/slices/renderSlice'
import EditorTopBar from '@/components/editor/EditorTopBar'
import Canvas3D from '@/components/editor/Canvas3D'
import LoadingSkeleton from '@/components/editor/LoadingSkeleton'
import api from '@/lib/api'

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const renderedImageUrl = useAppSelector((s) => s.render.renderedImageUrl)
  const status = useAppSelector((s) => s.render.status)

  useEffect(() => {
    if (!id) return

    const loadProject = async () => {
      dispatch(setStatus('analyzing'))
      try {
        const { data } = await api.get(`/api/v1/projects/${id}`)
        const project = data.data.project
        dispatch(setCurrent(project))
        if (project.renderedImageUrl) {
          dispatch(setRenderedImage({
            imageUrl: project.renderedImageUrl,
            sketchBase64: project.originalSketchBase64 ?? '',
          }))
        }
        toast.success('Project loaded', { duration: 1500 })
      } catch {
        toast.error('Failed to load project')
        navigate('/')
      }
    }

    if (!renderedImageUrl) {
      loadProject()
    } else {
      // Already have image from upload — just fetch metadata
      api.get(`/api/v1/projects/${id}`)
        .then(({ data }) => dispatch(setCurrent(data.data.project)))
        .catch(() => null)
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading = status === 'analyzing' && !renderedImageUrl

  return (
    <div className="h-screen w-screen bg-background flex flex-col">
      <EditorTopBar />
      {/* min-h-0 prevents flex child from overflowing; overflow-y-auto is the scroll container */}
      <main className="flex-1 min-h-0 pt-14 overflow-y-auto bg-zinc-950">
        {isLoading ? <LoadingSkeleton /> : <Canvas3D projectId={id!} />}
      </main>
    </div>
  )
}
