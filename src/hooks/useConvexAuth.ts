import { useEffect } from 'react'
import { authClient } from '#/lib/auth-client'

export function useConvexAuthSync() {
  const { data: session, isPending: authLoading } = authClient.useSession()

  useEffect(() => {
    if (session?.user && !authLoading) {
      // User is authenticated with Better Auth
      // Convex sync will be handled in the Convex provider or on-demand
      console.log('User authenticated:', session.user.email)
    }
  }, [session, authLoading])

  return {
    isLoading: authLoading,
    isAuthenticated: !!session?.user,
    user: session?.user,
  }
}
