import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/lib/types';

interface Props {
	project: Project;
}

export default function ProjectCard({ project }: Props) {
	const navigate = useNavigate();
	const { user } = useUser();

	const authorName =
		user?.firstName ?? user?.username ?? user?.primaryEmailAddress?.emailAddress?.split('@')[0] ?? 'Unknown';

	return (
		<Card className="group relative overflow-hidden border border-border/60 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_20px_-8px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-500 ease-out cursor-pointer">
			{/* Subtle glow overlay on hover */}
			<div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-white/0 via-white/0 to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

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

			<CardContent className="relative px-3 py-2.5">
				{/* Title — read-only on home page; rename & delete happen in the editor */}
				<p
					className="text-sm font-bold truncate group-hover:text-white transition-colors duration-300 cursor-pointer"
					onClick={() => navigate(`/editor/${project._id}`)}
				>
					{project.title}
				</p>

				<div className="mt-0.5 flex items-center justify-between gap-2">
					<p className="text-[11px] text-muted-foreground truncate">
						{formatDate(project.createdAt)}{' '}
						<span className="uppercase tracking-wider">by {authorName}</span>
					</p>

					{/* Arrow button */}
					<button
						onClick={() => navigate(`/editor/${project._id}`)}
						className="h-7 w-7 shrink-0 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 scale-50 translate-x-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-500 ease-out hover:bg-white/20 hover:border-white/40"
					>
						<ArrowUpRight className="h-3.5 w-3.5 text-white/90" />
					</button>
				</div>
			</CardContent>
		</Card>
	);
}
