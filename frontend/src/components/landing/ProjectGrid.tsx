import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProjects, setProjectsLoading } from '@/store/slices/projectSlice';
import ProjectCard from './ProjectCard';
import api from '@/lib/api';
import type { Project } from '@/lib/types';

export default function ProjectGrid() {
	const dispatch = useAppDispatch();
	const { list, loading } = useAppSelector((s) => s.project);

	useEffect(() => {
		const load = async () => {
			dispatch(setProjectsLoading(true));
			try {
				const { data } = await api.get<{ data: { projects: Project[] } }>('/api/v1/projects');
				dispatch(setProjects(data.data.projects));
			} finally {
				dispatch(setProjectsLoading(false));
			}
		};
		load();
	}, [dispatch]);

	return (
		<section className="container pt-10 pb-16 pl-10 md:pl-16">
			<div className="mb-6 ml-20">
				<h2 className="text-2xl font-bold">Projects</h2>
				<p className="text-muted-foreground mt-1 text-sm">
					Your latest work and shared community projects, all in one place.
				</p>
			</div>

			{loading ? (
				<div className="ml-20 flex flex-col items-center justify-center gap-3 py-24">
					<Loader2 className="h-8 w-8 text-primary animate-spin" />
					<p className="text-sm text-muted-foreground">Loading your projects…</p>
				</div>
			) : list.length === 0 ? (
				<div className="ml-20 grid-bg rounded-2xl border border-dashed border-border p-16 text-center">
					<p className="text-4xl mb-4">🏗️</p>
					<p className="text-muted-foreground">No projects yet — upload your first floor plan above.</p>
				</div>
			) : (
				<div className="ml-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{list.map((project) => (
						<ProjectCard key={project._id} project={project} />
					))}
				</div>
			)}
		</section>
	);
}
