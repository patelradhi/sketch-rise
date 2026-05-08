import { useNavigate } from 'react-router-dom'
import { Users, Square } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import PageBackground from '@/components/layout/PageBackground'
import BackButton from '@/components/shared/BackButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AccentKey = 'neutral' | 'violet' | 'emerald'

type Plan = {
  name: string
  price: string
  period: string
  desc: string
  cta: string
  features: string[]
  accent: AccentKey
  badge?: { label: string; icon?: typeof Users }
}

const plans: Plan[] = [
  {
    name: 'FREE',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for trying out SketchRise.',
    cta: 'Get started',
    features: ['5 renders per month', 'PNG export', 'Public sharing links', 'Community support'],
    accent: 'neutral',
  },
  {
    name: 'PRO',
    price: '$10',
    period: '/month',
    desc: 'For architects & designers who need more.',
    cta: 'Upgrade to Pro',
    features: [
      'Unlimited renders',
      'PNG & JPEG export',
      'Priority AI processing',
      'Private projects',
      'Email support',
    ],
    accent: 'violet',
    badge: { label: 'MOST POPULAR' },
  },
  {
    name: 'TEAM',
    price: '$15',
    period: '/month',
    desc: 'Collaborate across your firm.',
    cta: 'Contact sales',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared project library',
      'Admin dashboard',
      'Dedicated support',
    ],
    accent: 'emerald',
    badge: { label: 'BEST FOR TEAMS', icon: Users },
  },
]

const accentTheme: Record<AccentKey, {
  label: string
  borderWrapper: string
  button: string
  badge: string
  featureIcon: string
  glow: string
}> = {
  neutral: {
    label: 'text-muted-foreground',
    borderWrapper: 'border border-border bg-card',
    button: '',
    badge: '',
    featureIcon: 'text-muted-foreground',
    glow: '',
  },
  violet: {
    label: 'text-indigo-500',
    borderWrapper: 'bg-gradient-to-b from-indigo-500 via-violet-500 to-pink-500 p-[1.5px]',
    button: 'bg-indigo-500 hover:bg-indigo-600 text-white border-0',
    badge: 'bg-indigo-500 text-white',
    featureIcon: 'text-violet-500',
    glow: 'shadow-[0_0_40px_-12px_rgba(139,92,246,0.25)]',
  },
  emerald: {
    label: 'text-emerald-500',
    borderWrapper: 'bg-emerald-500 p-[1.5px]',
    button: 'bg-emerald-500 hover:bg-emerald-600 text-white border-0',
    badge: 'bg-emerald-500 text-white',
    featureIcon: 'text-emerald-500',
    glow: 'shadow-[0_0_40px_-12px_rgba(16,185,129,0.25)]',
  },
}

export default function PricingPage() {
  const navigate = useNavigate()

  const handleCTA = (cta: string) => {
    if (cta === 'Get started') {
      navigate('/', { state: { scrollToUpload: true } })
    } else if (cta === 'Upgrade to Pro') {
      toast.info('Pro plans are coming soon — stay tuned!', {
        description: "We're polishing billing & priority rendering. You'll be the first to know when it's live.",
      })
    } else if (cta === 'Contact sales') {
      toast.info('Team plans are coming soon!', {
        description: "We're setting up dedicated team workspaces. Drop us a line later or check back in a few weeks.",
      })
    }
  }

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <PageBackground />
      <Navbar />
      <main className="relative z-10 pt-16">
        <BackButton />
        <section className="container py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Pick a plan, <span className="text-primary">Start building</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto mb-16">
            Start free. Upgrade when you need unlimited renders and pro features.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left pt-4">
            {plans.map((plan) => {
              const a = accentTheme[plan.accent]
              const isAccented = plan.accent !== 'neutral'

              return (
                <div key={plan.name} className="relative h-full">
                  {/* Pop-out badge */}
                  {plan.badge && (
                    <div
                      className={cn(
                        'absolute -top-3.5 left-1/2 -translate-x-1/2 z-10',
                        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap shadow-md',
                        a.badge,
                      )}
                    >
                      {plan.badge.icon && <plan.badge.icon className="h-3 w-3" />}
                      {plan.badge.label}
                    </div>
                  )}

                  {/* Card wrapper — gradient or solid border + colored glow */}
                  <div className={cn('rounded-2xl h-full', a.borderWrapper, a.glow)}>
                    <div
                      className={cn(
                        'rounded-2xl p-7 h-full flex flex-col',
                        isAccented && 'bg-card',
                      )}
                    >
                      {/* Tier label */}
                      <span className={cn('text-xs font-bold tracking-widest mb-3', a.label)}>
                        {plan.name}
                      </span>

                      {/* Price */}
                      <div className="mb-3 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold tracking-tight text-foreground">
                          {plan.price}
                        </span>
                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed min-h-[2.75rem]">
                        {plan.desc}
                      </p>

                      {/* CTA Button (in the middle of the card, not bottom) */}
                      <Button
                        onClick={() => handleCTA(plan.cta)}
                        className={cn('w-full h-10 font-semibold mb-6', isAccented && a.button)}
                        variant={isAccented ? 'default' : 'outline'}
                      >
                        {plan.cta}
                      </Button>

                      {/* Divider */}
                      <hr className="border-border mb-5" />

                      {/* Features list (icons only in dark mode) */}
                      <ul className="space-y-3 flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                            <Square
                              className={cn('hidden dark:inline-block h-3 w-3 shrink-0', a.featureIcon)}
                              strokeWidth={2.5}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
