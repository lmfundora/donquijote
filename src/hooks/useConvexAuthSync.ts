import { useEffect } from 'react'
import { authClient } from '#/lib/auth-client'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function useConvexAuthSync() {
  const { data: session, isPending: authLoading } = authClient.useSession()
  const syncUser = useMutation(api.users.syncUser)

  useEffect(() => {
    if (session?.user && !authLoading) {
      // Sync user to Convex when authenticated with Better Auth
      syncUser({
        email: session.user.email,
        name: session.user.name || undefined,
        image: session.user.image || undefined,
      })
    }
  }, [session, authLoading, syncUser])

  return {
    isLoading: authLoading,
    isAuthenticated: !!session?.user,
    user: session?.user,
  }
}
