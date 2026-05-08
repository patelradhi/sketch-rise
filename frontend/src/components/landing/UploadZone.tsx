import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';
import { useAnalyze } from '@/hooks/useAnalyze';
import { useAppSelector } from '@/store/hooks';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/constants';

const STATUS_LABELS: Record<string, string> = {
	compressing: 'Preparing image…',
	analyzing: 'Generating your 3D render… (~30s)',
	saving: 'Saving your project…',
	error: 'Something went wrong — try again',
};

const STATUS_PROGRESS: Record<string, number> = {
	compressing: 20,
	analyzing: 60,
	saving: 90,
	success: 100,
};

export default function UploadZone() {
	const { isSignedIn } = useAuth();
	const navigate = useNavigate();
	const { analyze, status } = useAnalyze();
	useAppSelector((s) => s.render.status);

	const busy = ['compressing', 'analyzing', 'saving'].includes(status);

	const onDrop = useCallback(
		(accepted: File[]) => {
			if (!isSignedIn) {
				navigate('/sign-in');
				return;
			}
			const file = accepted[0];
			if (file) analyze(file);
		},
		[analyze, isSignedIn, navigate],
	);

	const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
		onDrop,
		accept: ACCEPTED_IMAGE_TYPES,
		maxSize: MAX_UPLOAD_BYTES,
		maxFiles: 1,
		disabled: busy || !isSignedIn,
	});

	const wrapperProps = isSignedIn
		? getRootProps()
		: { onClick: () => navigate('/sign-in'), role: 'button', tabIndex: 0 };

	const rejection = fileRejections[0]?.errors[0];
	const progress = STATUS_PROGRESS[status] ?? 0;

	return (
		<section id="upload-zone" className="container pt-6 pb-10">
			<div className="max-w-3xl mx-auto">
				{/* Caption */}

				{/* Title */}
				<h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-2">
					Upload your floor plan
				</h2>
				<p className="text-sm text-muted-foreground text-center mb-8">
					Drag &amp; drop a file, or click anywhere to browse.
				</p>

				{/* Drop zone */}
				<div
					{...wrapperProps}
					id="dropzone-target"
					className={cn(
						'relative rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-200 px-6 py-16 sm:py-20 text-center',
						isDragActive
							? 'border-primary bg-primary/5'
							: 'border-border hover:border-primary/50 hover:bg-secondary/40',
						busy && 'pointer-events-none opacity-80',
					)}
				>
					{isSignedIn && <input {...getInputProps()} />}

					{/* Corner dots */}
					<span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-rose-500/70" />
					<span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-indigo-500/70" />
					<span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-violet-500/70" />
					<span className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-rose-500/70" />

					<div className="flex flex-col items-center gap-4">
						{/* Center icon */}
						<div
							className={cn(
								'flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-colors',
								'bg-gradient-to-br from-primary/30 to-violet-500/20 border-primary/30 shadow-lg shadow-primary/20',
							)}
						>
							{busy ? (
								<Loader2 className="h-7 w-7 text-primary animate-spin" />
							) : isDragActive ? (
								<ImageIcon className="h-7 w-7 text-primary" />
							) : (
								<Upload className="h-7 w-7 text-primary" />
							)}
						</div>

						{busy ? (
							<div className="w-full max-w-xs space-y-2">
								<p className="text-sm font-medium text-foreground">
									{STATUS_LABELS[status] ?? 'Uploading…'}
								</p>
								<Progress value={progress} className="h-1.5" />
								<p className="text-[10px] text-muted-foreground">{progress}%</p>
							</div>
						) : (
							<>
								<p className="text-base font-semibold text-foreground">
									{!isSignedIn
										? 'Sign in to upload your floor plan'
										: isDragActive
											? 'Drop your floor plan here'
											: 'Drop your floor plan here'}
								</p>
								{isSignedIn && (
									<p className="text-xs text-muted-foreground">
										or{' '}
										<span className="text-primary font-medium underline-offset-2 hover:underline">
											click to browse
										</span>{' '}
										from your computer
									</p>
								)}

								{/* File-type pills */}
								<div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
									<span className="px-2 py-0.5 rounded-md border border-border bg-card text-[10px] font-medium text-muted-foreground">
										JPG
									</span>
									<span className="px-2 py-0.5 rounded-md border border-border bg-card text-[10px] font-medium text-muted-foreground">
										PNG
									</span>
									<span className="text-[10px] text-muted-foreground">·</span>
									<span className="text-[10px] text-muted-foreground">max 10 MB</span>
								</div>
							</>
						)}
					</div>
				</div>

				{rejection && <p className="text-center text-xs text-destructive mt-4">{rejection.message}</p>}
			</div>
		</section>
	);
}
