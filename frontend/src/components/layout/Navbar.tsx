import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Box } from 'lucide-react'

export default function Navbar() {
  const { user } = useUser()

  return (
    <header className="fixed top-0 z-40 w-full glass border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
            <Box className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Sketch<span className="text-primary">Rise</span>
          </span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/product" className="hover:text-foreground transition-colors">Product</Link>
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/community" className="hover:text-foreground transition-colors">Community</Link>
          <Link to="/enterprise" className="hover:text-foreground transition-colors">Enterprise</Link>
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:block text-sm text-muted-foreground">
              Hi, <span className="text-foreground font-medium">{user.firstName ?? user.username}</span>
            </span>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}
