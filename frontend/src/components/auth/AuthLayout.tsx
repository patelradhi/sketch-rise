import { Link } from 'react-router-dom';
import { Layers, Sparkles, Zap, ImageIcon } from 'lucide-react';

interface AuthLayoutProps {
	children: React.ReactNode;
	title?: string;
	subtitle?: string;
}

const valueProps = [
	{ icon: Zap, text: 'Avg 2 second render time' },
	{ icon: Sparkles, text: 'Photorealistic 3D output' },
];

export default function AuthLayout({
	children,
	title = 'Turn your sketch into a 3D space, instantly.',
	subtitle = 'Drop in a floor plan and SketchRise generates a photorealistic 3D render in seconds — no CAD skills needed.',
}: AuthLayoutProps) {
	return (
		<div className="min-h-screen lg:flex">
			{/* ─── Brand panel — desktop only ─────────────────────────── */}
			<aside className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white">
				{/* Subtle dot pattern overlay */}
				<div
					className="absolute inset-0 opacity-25 pointer-events-none"
					style={{
						backgroundImage:
							'radial-gradient(circle at center, rgba(255,255,255,0.5) 1px, transparent 1px)',
						backgroundSize: '24px 24px',
					}}
				/>

				{/* Soft ambient glow */}
				<div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/15 blur-3xl pointer-events-none" />
				<div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pink-400/30 blur-3xl pointer-events-none" />

				{/* Top: Logo */}
				<Link to="/" className="relative z-10 flex items-center gap-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur ring-1 ring-white/30">
						<Layers className="h-4 w-4" />
					</div>
					<span className="text-lg font-bold tracking-tight">SketchRise</span>
				</Link>

				{/* Middle: Hero copy + value props */}
				<div className="relative z-10 max-w-md">
					<h1 className="text-4xl font-bold leading-tight mb-4">{title}</h1>
					<p className="text-white/85 mb-8 leading-relaxed">{subtitle}</p>

					<ul className="space-y-3">
						{valueProps.map(({ icon: Icon, text }) => (
							<li key={text} className="flex items-center gap-3 text-sm text-white/90">
								<div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/15 backdrop-blur ring-1 ring-white/20">
									<Icon className="h-3.5 w-3.5" />
								</div>
								{text}
							</li>
						))}
					</ul>
				</div>

				{/* Bottom: tagline */}
				<p className="relative z-10 text-xs text-white/70">
					© {new Date().getFullYear()} SketchRise · Made for designers
				</p>
			</aside>

			{/* ─── Form panel ─────────────────────────────────────────── */}
			<div
				className="relative flex-1 flex flex-col bg-background dark:bg-zinc-900"
				style={{
					backgroundImage: `
						linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
						linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
					`,
					backgroundSize: '60px 60px',
				}}
			>
				{/* Mobile-only logo header (when brand panel is hidden) */}
				<div className="lg:hidden flex items-center justify-center pt-10 pb-2">
					<Link to="/" className="flex items-center gap-2 text-foreground">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
							<Layers className="h-4 w-4 text-primary" />
						</div>
						<span className="text-lg font-bold tracking-tight">
							Sketch<span className="text-primary">Rise</span>
						</span>
					</Link>
				</div>

				<main className="flex-1 flex items-center justify-center p-6">{children}</main>
			</div>
		</div>
	);
}
