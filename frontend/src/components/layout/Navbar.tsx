import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Tag, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user } = useUser()
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 z-40 w-full glass">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Sketch<span className="text-primary">Rise</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <Link to="/product" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Box className="h-4 w-4 text-violet-500" />
            Product
          </Link>
          <Link to="/pricing" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Tag className="h-4 w-4 text-pink-500" />
            Pricing
          </Link>
          {/* Hidden until ready — restore by uncommenting:
          <Link to="/community" className="hover:text-foreground transition-colors">Community</Link>
          <Link to="/enterprise" className="hover:text-foreground transition-colors">Enterprise</Link>
          */}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SignedIn>
            {user && (
              <span className="hidden sm:block text-sm text-muted-foreground">
                Hi, <span className="text-foreground font-medium">{user.firstName ?? user.username}</span>
              </span>
            )}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/sign-in')}
              className="font-medium"
            >
              Sign in
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
