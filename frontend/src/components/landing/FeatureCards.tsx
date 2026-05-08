import { Aperture, Zap, ImageIcon } from 'lucide-react';

interface Feature {
	icon: React.ReactNode;
	iconBg: string;
	iconRing: string;
	title: string;
	description: string;
}

const features: Feature[] = [
	{
		icon: <Aperture className="h-5 w-5 text-violet-500" />,
		iconBg: 'bg-violet-500/15',
		iconRing: 'ring-violet-500/30',
		title: 'Photorealistic 3D',
		description: 'Materials, lighting, and shadows handled automatically — no manual setup needed.',
	},
	{
		icon: <Zap className="h-5 w-5 text-orange-500" />,
		iconBg: 'bg-orange-500/15',
		iconRing: 'ring-orange-500/30',
		title: '2 sec render',
		description: 'Instant feedback, every time.',
	},
	{
		icon: <ImageIcon className="h-5 w-5 text-emerald-500" />,
		iconBg: 'bg-emerald-500/15',
		iconRing: 'ring-emerald-500/30',
		title: 'Any sketch',
		description: 'Hand-drawn or digital.',
	},
];

export default function FeatureCards() {
	return (
		<section className="container py-8">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
				{features.map((f) => (
					<div
						key={f.title}
						className="group relative rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
					>
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 mb-4 ${f.iconBg} ${f.iconRing}`}
						>
							{f.icon}
						</div>
						<h3 className="text-base font-semibold text-foreground mb-1.5">{f.title}</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}
