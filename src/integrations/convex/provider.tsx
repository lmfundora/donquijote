import { ConvexProvider } from 'convex/react'
import { ConvexQueryClient } from '@convex-dev/react-query'

let convexQueryClient: ConvexQueryClient | null = null

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL
  
  if (!CONVEX_URL) {
    console.warn('VITE_CONVEX_URL not set, Convex features will be disabled')
    return <>{children}</>
  }

  if (!convexQueryClient) {
    convexQueryClient = new ConvexQueryClient(CONVEX_URL)
  }

  return (
    <ConvexProvider client={convexQueryClient.convexClient}>
      {children}
    </ConvexProvider>
  )
}
