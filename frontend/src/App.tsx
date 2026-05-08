import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from '@clerk/clerk-react'
import { Toaster } from 'sonner'
import LandingPage from '@/pages/LandingPage'
import EditorPage from '@/pages/EditorPage'
import SharedView from '@/pages/SharedView'
import ProductPage from '@/pages/ProductPage'
import PricingPage from '@/pages/PricingPage'
import CommunityPage from '@/pages/CommunityPage'
import EnterprisePage from '@/pages/EnterprisePage'
import DemoPage from '@/pages/DemoPage'
import AuthLayout from '@/components/auth/AuthLayout'

const clerkAppearance = {
  elements: {
    rootBox: 'w-full max-w-md',
    card: 'bg-card border border-border shadow-2xl rounded-2xl',
    headerTitle: 'text-foreground',
    headerSubtitle: 'text-muted-foreground',
    socialButtonsBlockButton:
      'bg-background border border-border hover:bg-secondary text-foreground transition-colors',
    socialButtonsBlockButtonText: 'text-foreground font-medium',
    dividerLine: 'bg-border',
    dividerText: 'text-muted-foreground',
    formFieldLabel: 'text-foreground',
    formFieldInput: 'bg-background border-border text-foreground',
    formButtonPrimary:
      'bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 hover:opacity-90 text-white normal-case font-semibold shadow-md shadow-pink-500/20',
    footer: 'bg-card border-t border-border rounded-b-2xl',
    footerAction: 'bg-card',
    footerActionText: 'text-muted-foreground',
    footerActionLink: 'text-primary hover:text-primary/80 font-medium',
    footerPagesLink: 'text-muted-foreground hover:text-foreground',
    identityPreviewEditButton: 'text-primary',
    formFieldInputShowPasswordButton: 'text-muted-foreground',
  },
  variables: {
    colorPrimary: '#8b5cf6',
    colorBackground: 'hsl(var(--card))',
    colorText: 'hsl(var(--foreground))',
    colorTextSecondary: 'hsl(var(--muted-foreground))',
    colorInputBackground: 'hsl(var(--background))',
    colorInputText: 'hsl(var(--foreground))',
    borderRadius: '0.75rem',
  },
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(224 71% 6%)',
            border: '1px solid hsl(216 34% 17%)',
            color: 'hsl(213 31% 91%)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/enterprise" element={<EnterprisePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/share/:token" element={<SharedView />} />
        <Route
          path="/sign-in/*"
          element={
            <SignedOut>
              <AuthLayout>
                <SignIn
                  routing="path"
                  path="/sign-in"
                  afterSignInUrl="/"
                  appearance={clerkAppearance}
                />
              </AuthLayout>
            </SignedOut>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <SignedOut>
              <AuthLayout
                title="Start turning sketches into 3D."
                subtitle="Create your free account and generate your first photorealistic 3D render in under a minute."
              >
                <SignUp
                  routing="path"
                  path="/sign-up"
                  afterSignUpUrl="/"
                  appearance={clerkAppearance}
                />
              </AuthLayout>
            </SignedOut>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
