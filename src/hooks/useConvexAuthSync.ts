import { authClient } from '#/lib/auth-client'

export function useConvexAuthSync() {
  const { data: session, isPending: authLoading } = authClient.useSession()

  // Better Auth handles user synchronization automatically through the component
  // No manual sync needed

  return {
    isLoading: authLoading,
    isAuthenticated: !!session?.user,
    user: session?.user,
  }
}
