import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AnimatedDemo from '@/components/landing/AnimatedDemo'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <AnimatedDemo />
      </main>
    </div>
  )
}
