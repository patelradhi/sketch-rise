import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from '@clerk/clerk-react'
import { Toaster } from 'sonner'
import LandingPage from '@/pages/LandingPage'
import EditorPage from '@/pages/EditorPage'
import SharedView from '@/pages/SharedView'

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
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />
        <Route path="/share/:token" element={<SharedView />} />
        <Route
          path="/sign-in/*"
          element={
            <SignedOut>
              <SignIn routing="path" path="/sign-in" afterSignInUrl="/" />
            </SignedOut>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <SignedOut>
              <SignUp routing="path" path="/sign-up" afterSignUpUrl="/" />
            </SignedOut>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
