import { Link } from 'react-router-dom'
import { Upload, Cpu, Download, ArrowRight, Layers, Zap, Shield } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import BackButton from '@/components/shared/BackButton'
import { Button } from '@/components/ui/button'

const steps = [
  { icon: Upload, title: 'Upload Your Sketch', desc: 'Drop a hand-drawn floor plan or 2D blueprint. JPEG, PNG, or PDF.' },
  { icon: Cpu, title: 'AI Generates 3D', desc: 'Our model converts your sketch into a photorealistic 3D render in seconds.' },
  { icon: Download, title: 'Export & Share', desc: 'Download high-res PNG/JPEG or share a public link with clients.' },
]

const features = [
  { icon: Zap, title: 'Instant Renders', desc: 'No waiting. Get photorealistic output in under 30 seconds.' },
  { icon: Layers, title: 'Smart Room Detection', desc: 'AI labels bedrooms, kitchens, bathrooms, and closets automatically.' },
  { icon: Shield, title: 'Private by Default', desc: 'Your designs stay private. Share only when you choose to.' },
]

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <BackButton />
        {/* Hero */}
        <section className="container py-12 text-center">
          <p className="text-xs uppercase tracking-widest text-primary mb-3">How It Works</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            From sketch to <span className="text-primary">stunning 3D</span> in seconds
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            SketchRise uses advanced AI to transform rough floor plan sketches into photorealistic 3D visualizations — no CAD skills needed.
          </p>
        </section>

        {/* Steps */}
        <section className="container pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/15 flex items-center justify-center">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">Step {i + 1}</p>
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="container pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">Why professionals choose SketchRise</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/15 flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="container pb-20">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">Ready to transform your sketches?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload your first floor plan and get a photorealistic 3D render in seconds.
            </p>
            <Link to="/">
              <Button size="lg" className="gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
