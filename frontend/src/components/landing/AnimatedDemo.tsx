import { useEffect, useRef, useState } from 'react'
import { Upload, Cpu, Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { icon: Upload, label: 'Drop your 2D sketch', duration: 2500 },
  { icon: Cpu, label: 'AI analyzing layout...', duration: 3000 },
  { icon: Sparkles, label: 'Generating 3D render...', duration: 2500 },
  { icon: Check, label: 'Your 3D render is ready!', duration: 2500 },
]

export default function AnimatedDemo() {
  const [step, setStep] = useState(-1)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Auto-start when scrolled into view
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) { setStarted(true); setStep(0) } },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [started])

  // Step through the animation
  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return
    const t = setTimeout(() => {
      if (step < STEPS.length - 1) setStep(step + 1)
      else setTimeout(() => { setStep(0) }, 2000) // loop after pause
    }, STEPS[step].duration)
    return () => clearTimeout(t)
  }, [step])

  const isSketch = step <= 0
  const isProcessing = step === 1 || step === 2
  const isDone = step === 3

  return (
    <section ref={ref} id="demo" className="container pb-20">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-primary mb-2">Live Demo</p>
        <h2 className="text-3xl font-bold">See the magic in action</h2>
      </div>

      <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <p className="flex-1 text-center text-xs text-muted-foreground font-mono">sketchrise.app</p>
        </div>

        {/* Canvas area */}
        <div className="relative aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden">
          {/* Sketch image (step 0) */}
          <div className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-700',
            isSketch ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          )}>
            <div className="relative">
              {/* Fake sketch: grid lines + room labels */}
              <div className="w-72 h-52 border-2 border-dashed border-muted-foreground/40 rounded-lg grid grid-cols-2 grid-rows-2 gap-px overflow-hidden demo-drop-in">
                <div className="border border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground">Bedroom</div>
                <div className="border border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground">Kitchen</div>
                <div className="border border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground">Bath</div>
                <div className="border border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground">Living</div>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-3 animate-pulse">2D Floor Plan Sketch</p>
            </div>
          </div>

          {/* Processing animation (steps 1-2) */}
          <div className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-500',
            isProcessing ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}>
            <div className="text-center space-y-4">
              <div className="relative mx-auto h-20 w-20">
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="h-7 w-7 text-primary" />
                </div>
              </div>
              {/* Scanning lines */}
              <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-primary rounded-full demo-progress" />
              </div>
              <p className="text-sm text-muted-foreground">{STEPS[step]?.label}</p>
            </div>
          </div>

          {/* 3D Result (step 3) */}
          <div className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-700',
            isDone ? 'opacity-100 scale-100' : 'opacity-0 scale-110',
          )}>
            <div className="relative">
              {/* Fake 3D render — colored rooms with depth feel */}
              <div className="w-80 h-56 rounded-xl overflow-hidden shadow-2xl shadow-primary/20 border border-primary/20 grid grid-cols-2 grid-rows-2 demo-fade-up">
                <div className="bg-amber-900/40 flex items-end p-3 border-r border-b border-zinc-700">
                  <span className="text-[10px] font-bold text-amber-200/80">Bedroom</span>
                </div>
                <div className="bg-emerald-900/30 flex items-end p-3 border-b border-zinc-700">
                  <span className="text-[10px] font-bold text-emerald-200/80">Kitchen</span>
                </div>
                <div className="bg-sky-900/30 flex items-end p-3 border-r border-zinc-700">
                  <span className="text-[10px] font-bold text-sky-200/80">Bath</span>
                </div>
                <div className="bg-violet-900/30 flex items-end p-3">
                  <span className="text-[10px] font-bold text-violet-200/80">Living Room</span>
                </div>
              </div>
              <p className="text-center text-xs text-primary font-semibold mt-3">Photorealistic 3D Render</p>
            </div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-6 px-4 py-4 border-t border-border bg-secondary/30">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                i <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground',
              )}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={cn(
                'hidden sm:block text-xs transition-colors',
                i <= step ? 'text-foreground' : 'text-muted-foreground',
              )}>
                {s.label.replace('...', '')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
