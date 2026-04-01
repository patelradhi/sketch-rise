import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setProjects, setProjectsLoading } from '@/store/slices/projectSlice'
import { Skeleton } from '@/components/ui/skeleton'
import ProjectCard from './ProjectCard'
import api from '@/lib/api'
import type { Project } from '@/lib/types'

export default function ProjectGrid() {
  const dispatch = useAppDispatch()
  const { list, loading } = useAppSelector((s) => s.project)

  useEffect(() => {
    const load = async () => {
      dispatch(setProjectsLoading(true))
      try {
        const { data } = await api.get<{ data: { projects: Project[] } }>('/api/v1/projects')
        dispatch(setProjects(data.data.projects))
      } finally {
        dispatch(setProjectsLoading(false))
      }
    }
    load()
  }, [dispatch])

  return (
    <section className="container py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Projects</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Your latest work and shared community projects, all in one place.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden border border-border">
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="grid-bg rounded-2xl border border-dashed border-border p-16 text-center">
          <p className="text-4xl mb-4">🏗️</p>
          <p className="text-muted-foreground">No projects yet — upload your first floor plan above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
