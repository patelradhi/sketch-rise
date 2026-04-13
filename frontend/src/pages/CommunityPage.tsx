import { Link } from 'react-router-dom'
import { Globe, Users, MessageSquare, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import BackButton from '@/components/shared/BackButton'
import { Button } from '@/components/ui/button'

const highlights = [
  { icon: Globe, title: 'Public Gallery', desc: 'Browse 3D renders shared by designers worldwide. Get inspired by real floor plans.' },
  { icon: Users, title: 'Growing Network', desc: 'Join architects, interior designers, and students using SketchRise every day.' },
  { icon: MessageSquare, title: 'Share & Get Feedback', desc: 'Publish your renders with one click. Get feedback from the community.' },
]

const stats = [
  { value: '2,500+', label: 'Renders Created' },
  { value: '800+', label: 'Active Users' },
  { value: '50+', label: 'Countries' },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <BackButton />
        {/* Hero */}
        <section className="container py-12 text-center">
          <p className="text-xs uppercase tracking-widest text-primary mb-3">Community</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Built by designers, <span className="text-primary">for designers</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            SketchRise is shaped by its community. Share your work, explore others, and grow together.
          </p>
          <Link to="/">
            <Button size="lg" className="gap-2">Explore Gallery <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </section>

        {/* Stats */}
        <section className="container pb-16">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-6 text-center">
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Highlights */}
        <section className="container pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/15 flex items-center justify-center">
                  <h.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{h.title}</h3>
                  <p className="text-sm text-muted-foreground">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
