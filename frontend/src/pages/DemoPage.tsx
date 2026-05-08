import BackButton from '@/components/shared/BackButton'
import AnimatedDemo from '@/components/landing/AnimatedDemo'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <BackButton />

      <main className="pt-20 pb-20">
        <AnimatedDemo />
      </main>
    </div>
  )
}
