import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { Download, Share2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrent, updateProjectTitle } from '@/store/slices/projectSlice';
import { setRenderedImage, setStatus } from '@/store/slices/renderSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EditorTopBar from '@/components/editor/EditorTopBar';
import LoadingSkeleton from '@/components/editor/LoadingSkeleton';
import ShareModal from '@/components/shared/ShareModal';
import ExportModal from '@/components/shared/ExportModal';
import api from '@/lib/api';

export default function EditorPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { user } = useUser();
	const project = useAppSelector((s) => s.project.current);
	const renderedImageUrl = useAppSelector((s) => s.render.renderedImageUrl);
	const status = useAppSelector((s) => s.render.status);

	const [editingTitle, setEditingTitle] = useState(false);
	const [title, setTitle] = useState('');
	const [saving, setSaving] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);
	const [exportOpen, setExportOpen] = useState(false);

	const authorName =
		user?.firstName ?? user?.username ?? user?.primaryEmailAddress?.emailAddress?.split('@')[0] ?? 'You';

	useEffect(() => {
		if (!id) return;

		const loadProject = async () => {
			dispatch(setStatus('analyzing'));
			try {
				const { data } = await api.get(`/api/v1/projects/${id}`);
				const proj = data.data.project;
				dispatch(setCurrent(proj));
				setTitle(proj.title);
				if (proj.renderedImageUrl) {
					dispatch(
						setRenderedImage({
							imageUrl: proj.renderedImageUrl,
							sketchBase64: proj.originalSketchBase64 ?? '',
						}),
					);
				}
				toast.success('Project loaded', { duration: 1500 });
			} catch {
				toast.error('Failed to load project');
				navigate('/');
			}
		};

		if (!renderedImageUrl) {
			loadProject();
		} else {
			api.get(`/api/v1/projects/${id}`)
				.then(({ data }) => {
					const proj = data.data.project;
					dispatch(setCurrent(proj));
					setTitle(proj.title);
				})
				.catch(() => null);
		}
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	const saveTitle = async () => {
		setEditingTitle(false);
		if (!project || title === project.title) return;
		setSaving(true);
		try {
			await api.patch(`/api/v1/projects/${project._id}`, { title });
			dispatch(updateProjectTitle({ id: project._id, title }));
		} catch {
			toast.error('Failed to save title');
		} finally {
			setSaving(false);
		}
	};

	const isLoading = status === 'analyzing' && !renderedImageUrl;

	return (
		<div className="h-screen w-screen bg-background flex flex-col">
			<EditorTopBar />

			<main className="flex-1 min-h-0 pt-14 overflow-y-auto">
				<div className="max-w-5xl mx-auto p-6">
					{/* Single card: project info + render */}
					<div className="rounded-xl border border-border bg-card overflow-hidden">
						{/* Header: project info + buttons */}
						<div className="flex items-start justify-between gap-4 p-3 border-b border-border">
							<div className="min-w-0 flex-1">
								<p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0">
									Project
								</p>

								{editingTitle ? (
									<Input
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										onBlur={saveTitle}
										onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
										className="h-8 text-lg font-bold border-0 border-b rounded-none px-0 bg-transparent focus-visible:ring-0"
										autoFocus
									/>
								) : (
									<button
										className="text-lg font-bold hover:text-primary transition-colors flex items-center gap-2"
										onDoubleClick={() => setEditingTitle(true)}
									>
										{title || 'Untitled Project'}
										{saving && <Loader2 className="h-4 w-4 animate-spin" />}
									</button>
								)}

								<p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
									Created by {authorName}
								</p>
							</div>

							<div className="flex items-center gap-2 shrink-0">
								<Button
									size="sm"
									className="gap-2 bg-primary/20 text-primary hover:bg-primary/30 border-0"
									variant="outline"
									onClick={() => setExportOpen(true)}
								>
									<Download className="h-4 w-4" />
									EXPORT
								</Button>

								<Button
									size="sm"
									className="gap-2 bg-foreground text-background hover:bg-foreground/90"
									onClick={() => setShareOpen(true)}
								>
									<Share2 className="h-4 w-4" />
									SHARE
								</Button>
							</div>
						</div>

						{/* Render area */}
						<div className="bg-secondary/30 min-h-[400px] flex items-center justify-center p-6">
							{isLoading ? (
								<LoadingSkeleton />
							) : renderedImageUrl ? (
								<img
									src={renderedImageUrl}
									alt="AI-generated 3D floor plan render"
									className="block mx-auto rounded-lg"
									style={{ maxWidth: '900px', width: '100%' }}
									draggable={false}
								/>
							) : (
								<p className="text-muted-foreground">No render available</p>
							)}
						</div>
					</div>
				</div>
			</main>

			{project && (
				<>
					<ShareModal open={shareOpen} onClose={() => setShareOpen(false)} projectId={project._id} />
					<ExportModal open={exportOpen} onClose={() => setExportOpen(false)} projectTitle={title} imageUrl={renderedImageUrl ?? undefined} />
				</>
			)}
		</div>
	);
}
