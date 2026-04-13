import { Link } from 'react-router-dom'
import { Building2, Lock, Headphones, BarChart3 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import BackButton from '@/components/shared/BackButton'
import { Button } from '@/components/ui/button'

const benefits = [
  { icon: Building2, title: 'Multi-Team Workspaces', desc: 'Organize projects by team with role-based access and shared libraries.' },
  { icon: Lock, title: 'Enterprise Security', desc: 'SSO, audit logs, data residency options, and SOC 2 compliance roadmap.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'Priority onboarding, SLA-backed response times, and a dedicated account manager.' },
  { icon: BarChart3, title: 'Usage Analytics', desc: 'Track render volume, team activity, and project metrics from an admin dashboard.' },
]

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <BackButton />
        {/* Hero */}
        <section className="container py-12 text-center">
          <p className="text-xs uppercase tracking-widest text-primary mb-3">Enterprise</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            SketchRise for <span className="text-primary">your organization</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Scale AI-powered floor plan rendering across your architecture firm with enterprise-grade security and support.
          </p>
        </section>

        {/* Benefits grid */}
        <section className="container pb-20">
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl border border-border bg-card">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-primary/15 flex items-center justify-center">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container pb-20">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">Ready to scale?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tell us about your team and we'll put together a custom plan for your firm.
            </p>
            <Link to="/">
              <Button size="lg">Get in Touch</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
