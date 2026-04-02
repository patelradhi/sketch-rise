import { useState, useEffect, useCallback } from 'react'

type PuterAuthState = 'loading' | 'signed-out' | 'signed-in'

export function usePuterAuth() {
  const [state, setState] = useState<PuterAuthState>('loading')

  // Poll until window.puter is ready, then read auth state
  useEffect(() => {
    let cancelled = false
    const interval = setInterval(() => {
      if (cancelled) return
      if (window.puter?.auth) {
        clearInterval(interval)
        setState(window.puter.auth.isSignedIn() ? 'signed-in' : 'signed-out')
      }
    }, 100)
    // Timeout after 15s — Puter script failed to load
    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (!cancelled) setState('signed-out')
    }, 15_000)
    return () => {
      cancelled = true
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  // Called from a direct button click — popup is always allowed
  const signIn = useCallback(async () => {
    if (!window.puter?.auth) return
    try {
      await window.puter.auth.signIn()
      setState('signed-in')
    } catch {
      setState('signed-out')
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!window.puter?.auth) return
    await window.puter.auth.signOut()
    setState('signed-out')
  }, [])

  return { state, signIn, signOut }
}
