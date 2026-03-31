import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCurrent } from '@/store/slices/projectSlice'
import { setRenderData, setLoading, setError } from '@/store/slices/renderSlice'
import EditorTopBar from '@/components/editor/EditorTopBar'
import Canvas3D from '@/components/editor/Canvas3D'
import LoadingSkeleton from '@/components/editor/LoadingSkeleton'
import api from '@/lib/api'
import type { Project } from '@/lib/types'

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.render)
  const renderData = useAppSelector((s) => s.render.data)

  useEffect(() => {
    if (!id) return

    // If render data is already in store (came from upload), set current project
    const loadProject = async () => {
      dispatch(setLoading(true))
      try {
        const { data } = await api.get<Project>(`/api/projects/${id}`)
        dispatch(setCurrent(data))
        dispatch(setRenderData(data.renderData))
        toast.success('Project loaded', { duration: 2000 })
      } catch {
        dispatch(setError('Failed to load project'))
        toast.error('Failed to load project')
        navigate('/')
      }
    }

    if (!renderData) {
      loadProject()
    } else {
      // Still fetch to get full project metadata
      api.get<Project>(`/api/projects/${id}`)
        .then(({ data }) => dispatch(setCurrent(data)))
        .catch(() => null)
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return null

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <EditorTopBar />

      <main className="flex-1 pt-14 relative">
        {loading && !renderData ? (
          <LoadingSkeleton />
        ) : (
          <Canvas3D projectId={id!} />
        )}
      </main>
    </div>
  )
}
