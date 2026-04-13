import { useNavigate } from 'react-router-dom';
import { X, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditorTopBar() {
	const navigate = useNavigate();

	return (
		<header className="fixed top-0 z-40 w-full border-b border-border/50 flex items-center justify-between h-14 px-6 bg-background/80 backdrop-blur-md">
			{/* Left: Logo */}
			<div className="flex items-center gap-2">
				<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
					<Box className="h-3.5 w-3.5 text-primary" />
				</div>
				<span className="text-sm font-bold tracking-tight">
					Sketch<span className="text-primary">Rise</span>
				</span>
			</div>

			{/* Right: Exit Editor */}
			<Button
				variant="ghost"
				size="sm"
				className="gap-1.5 text-muted-foreground hover:text-foreground"
				onClick={() => navigate('/')}
			>
				<X className="h-4 w-4" />
				EXIT EDITOR
			</Button>
		</header>
	);
}
