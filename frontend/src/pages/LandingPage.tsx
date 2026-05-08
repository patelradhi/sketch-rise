import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageBackground from '@/components/layout/PageBackground'
import HeroSection from '@/components/landing/HeroSection'
import FeatureCards from '@/components/landing/FeatureCards'
import UploadZone from '@/components/landing/UploadZone'
import ProjectGrid from '@/components/landing/ProjectGrid'

const SCROLL_DURATION_MS = 1600

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function slowScrollTo(target: HTMLElement, duration = SCROLL_DURATION_MS): Promise<void> {
  return new Promise((resolve) => {
    const startY = window.scrollY
    const rect = target.getBoundingClientRect()
    const targetY = startY + rect.top - (window.innerHeight - rect.height) / 2
    const distance = targetY - startY
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      window.scrollTo(0, startY + distance * easeInOutQuad(t))
      if (t < 1) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })
}

export default function LandingPage() {
  const location = useLocation()
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (hasTriggered.current) return
    const state = location.state as { scrollToUpload?: boolean } | null
    if (!state?.scrollToUpload) return
    hasTriggered.current = true

    // Clear browser history state WITHOUT a React re-render (so this effect's
    // cleanup doesn't fire and kill the timeout below).
    window.history.replaceState({}, '', location.pathname)

    // Intentionally no cleanup — under React StrictMode, the cleanup would kill
    // the timer before it fires. The hasTriggered ref guards against double-runs.
    window.setTimeout(async () => {
      const target = document.getElementById('dropzone-target')
      if (!target) return
      await slowScrollTo(target)
      target.classList.add('highlight-pulse')
      window.setTimeout(() => target.classList.remove('highlight-pulse'), 2600)
    }, 250)
  }, [location])

  return (
    <div className="relative min-h-screen bg-background flex flex-col overflow-x-hidden">
      <PageBackground />

      <Navbar />

      <main className="relative z-10 flex-1 pt-16">
        <HeroSection />
        <FeatureCards />
        <UploadZone />
        <ProjectGrid />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
