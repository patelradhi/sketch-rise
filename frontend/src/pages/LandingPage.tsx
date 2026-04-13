import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import UploadZone from '@/components/landing/UploadZone'
import ProjectGrid from '@/components/landing/ProjectGrid'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <HeroSection />
        <UploadZone />
        <ProjectGrid />
      </main>
    </div>
  )
}
