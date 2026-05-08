import { Layers } from 'lucide-react';

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-border bg-card/40">
			<div className="container flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-xs text-muted-foreground">
				<div className="flex items-center gap-2">
					<div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
						<Layers className="h-3 w-3 text-primary" />
					</div>
					<span>© {year} SketchRise · Made for designers</span>
				</div>
				<a
					href="https://www.linkedin.com/in/patelradhi/"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-foreground transition-colors"
				>
					LinkedIn
				</a>
			</div>
		</footer>
	);
}
