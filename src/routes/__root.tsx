import {
  HeadContent,
  Scripts,
  Outlet,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { createServerFn } from "@tanstack/react-start";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import type { ConvexQueryClient } from "@convex-dev/react-query";

import type { QueryClient } from "@tanstack/react-query";
import { authClient } from "#/lib/auth-client";
import { getToken } from "#/lib/auth-server";

// Get auth information for SSR using available cookies
const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken();
});

import { Toaster } from "#/components/ui/sonner";

import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var mode='light';var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(mode);root.setAttribute('data-theme',mode);root.style.colorScheme=mode;}catch(e){}})();`;

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  beforeLoad: async (ctx) => {
    const token = await getAuth();

    // all queries, mutations and actions through TanStack Query will be
    // authenticated during SSR if we have a valid token
    if (token) {
      // During SSR only (the only time serverHttpClient exists),
      // set the auth token to make HTTP queries with.
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    }

    return {
      isAuthenticated: !!token,
      token,
    };
  },
  component: RootComponent,
});

function RootComponent() {
  const context = useRouteContext({ from: Route.id });
  return (
    <ConvexBetterAuthProvider
      client={context.convexQueryClient.convexClient}
      // @ts-expect-error - Type mismatch between better-auth versions, will be resolved in future update
      authClient={authClient}
      initialToken={context.token}
    >
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ConvexBetterAuthProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased bg-background [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
