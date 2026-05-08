import { Link } from 'react-router-dom'
import { Sparkles, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  const scrollToUpload = () => {
    document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section className="relative flex flex-col items-center text-center pt-24 pb-12 px-4">
      {/* Ambient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-6 text-foreground">
          Turn your sketch into a{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-500 to-fuchsia-500">
            3D space
          </span>{' '}
          instantly.
        </h1>

        {/* Subhead */}
        <p className="text-base sm:text-lg text-muted-foreground mx-auto mb-9 sm:whitespace-nowrap">
          Drop in a sketch. We handle parsing, walls, windows, and lighting — all in seconds.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button
            size="lg"
            onClick={scrollToUpload}
            className="gap-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 hover:from-indigo-600 hover:via-violet-600 hover:to-pink-600 text-white border-0 shadow-md shadow-pink-500/15"
          >
            Try it free
            <Sparkles className="h-4 w-4" />
          </Button>
          <Link to="/demo">
            <Button size="lg" variant="outline" className="gap-2">
              <PlayCircle className="h-4 w-4" />
              Watch 60s demo
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-10 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span><strong className="text-foreground font-semibold">2s</strong> avg render</span>
          </div>
          <div className="flex items-center gap-2">
            <span><strong className="text-foreground font-semibold">12k+</strong> plans built</span>
          </div>
          <div className="flex items-center gap-2">
            <span><strong className="text-foreground font-semibold">4.9★</strong> rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
