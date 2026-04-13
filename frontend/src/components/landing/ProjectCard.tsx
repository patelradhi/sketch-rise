import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { MoreHorizontal, Trash2, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { updateProjectTitle, removeProject } from '@/store/slices/projectSlice';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import type { Project } from '@/lib/types';

interface Props {
	project: Project;
}

export default function ProjectCard({ project }: Props) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { user } = useUser();
	const [editing, setEditing] = useState(false);
	const [title, setTitle] = useState(project.title);

	const authorName =
		user?.firstName ?? user?.username ?? user?.primaryEmailAddress?.emailAddress?.split('@')[0] ?? 'Unknown';

	const handleTitleSave = async () => {
		setEditing(false);
		if (title === project.title) return;
		try {
			await api.patch(`/api/v1/projects/${project._id}`, { title });
			dispatch(updateProjectTitle({ id: project._id, title }));
			toast.success('Project renamed');
		} catch {
			setTitle(project.title);
			toast.error('Failed to rename project');
		}
	};

	const handleDelete = async () => {
		try {
			await api.delete(`/api/v1/projects/${project._id}`);
			dispatch(removeProject(project._id));
			toast.success('Project deleted');
		} catch {
			toast.error('Failed to delete project');
		}
	};

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

				{/* Three-dot menu on thumbnail top-right */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-black/70"
							onClick={(e) => e.stopPropagation()}
						>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => navigate(`/editor/${project._id}`)}>
							<ExternalLink className="h-4 w-4" /> Open
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setEditing(true)}>Rename</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
							<Trash2 className="h-4 w-4" /> Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<CardContent className="relative px-3 py-2.5">
				{/* Title */}
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
						className="text-sm font-bold truncate group-hover:text-white transition-colors duration-300 cursor-text"
						onDoubleClick={(e) => {
							e.stopPropagation();
							setEditing(true);
						}}
						onClick={() => navigate(`/editor/${project._id}`)}
					>
						{project.title}
					</p>
				)}

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
