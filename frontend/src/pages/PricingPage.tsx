import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import BackButton from '@/components/shared/BackButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for trying out SketchRise.',
    features: ['5 renders per month', 'PNG export', 'Public sharing links', 'Community support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    desc: 'For architects & designers who need more.',
    features: ['Unlimited renders', 'PNG & JPEG export', 'Priority AI processing', 'Private projects', 'Email support'],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    desc: 'Collaborate across your firm.',
    features: ['Everything in Pro', 'Up to 10 team members', 'Shared project library', 'Admin dashboard', 'Dedicated support'],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <BackButton />
        <section className="container py-12 text-center">
          <p className="text-xs uppercase tracking-widest text-primary mb-3">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent <span className="text-primary">pricing</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto mb-14">
            Start free. Upgrade when you need unlimited renders and pro features.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'rounded-xl border bg-card p-6 flex flex-col',
                  plan.popular ? 'border-primary ring-1 ring-primary/30' : 'border-border',
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  {plan.popular && <Badge className="text-[10px]">Popular</Badge>}
                </div>
                <div className="mb-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/">
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>{plan.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
