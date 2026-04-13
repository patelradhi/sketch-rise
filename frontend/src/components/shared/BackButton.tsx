import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BackButton() {
  return (
    <Link to="/" className="fixed top-20 left-6 z-30">
      <Button size="icon" className="h-10 w-10 rounded-full shadow-lg">
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </Link>
  )
}
