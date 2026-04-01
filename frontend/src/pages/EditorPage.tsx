import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCurrent } from '@/store/slices/projectSlice'
import { setRenderData, setStatus } from '@/store/slices/renderSlice'
import EditorTopBar from '@/components/editor/EditorTopBar'
import Canvas3D from '@/components/editor/Canvas3D'
import LoadingSkeleton from '@/components/editor/LoadingSkeleton'
import api from '@/lib/api'
import type { Project } from '@/lib/types'

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const renderData = useAppSelector((s) => s.render.data)
  const status = useAppSelector((s) => s.render.status)

  useEffect(() => {
    if (!id) return

    const loadProject = async () => {
      dispatch(setStatus('analyzing'))
      try {
        const { data } = await api.get<{ data: { project: Project } }>(`/api/v1/projects/${id}`)
        const project = data.data.project
        dispatch(setCurrent(project))
        dispatch(setRenderData(project.renderData))
        toast.success('Project loaded', { duration: 1500 })
      } catch {
        toast.error('Failed to load project')
        navigate('/')
      }
    }

    if (!renderData) {
      loadProject()
    } else {
      // Already have renderData from upload — just fetch metadata
      api.get<{ data: { project: Project } }>(`/api/v1/projects/${id}`)
        .then(({ data }) => dispatch(setCurrent(data.data.project)))
        .catch(() => null)
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading = status === 'analyzing' && !renderData

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <EditorTopBar />
      <main className="flex-1 pt-14 relative">
        {isLoading ? <LoadingSkeleton /> : <Canvas3D projectId={id!} />}
      </main>
    </div>
  )
}
