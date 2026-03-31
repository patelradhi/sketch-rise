import { Sparkles, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center text-center pt-32 pb-16 px-4">
      {/* Ambient glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
          <Sparkles className="h-3 w-3" />
          Powered by Claude AI — claude-sonnet-4-20250514
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
          Turn your sketch into a{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            3D space
          </span>{' '}
          instantly.
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          Upload any hand-drawn or digital floor plan. Claude AI parses the layout and
          React Three Fiber builds a photorealistic 3D visualization in seconds.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
            <Sparkles className="h-4 w-4" />
            Start Building
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <PlayCircle className="h-4 w-4" />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">2s</p>
            <p>avg processing</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">PNG/JPG</p>
            <p>any sketch</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">3D</p>
            <p>instant render</p>
          </div>
        </div>
      </div>
    </section>
  )
}
