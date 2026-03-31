import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import UploadZone from '@/components/landing/UploadZone'
import ProjectGrid from '@/components/landing/ProjectGrid'
import { Separator } from '@/components/ui/separator'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <HeroSection />

        <div className="container">
          <Separator className="mb-10" />
        </div>

        <UploadZone />

        <ProjectGrid />
      </main>
    </div>
  )
}
