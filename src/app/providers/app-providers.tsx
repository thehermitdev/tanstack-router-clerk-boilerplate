import type { PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/react";
import { QueryClientProvider } from "@tanstack/react-query";

import {
  clerkRouterPush,
  clerkRouterReplace,
} from "#/app/auth/clerk-navigation";
import { queryClient } from "#/app/query-client/query-client";
import { env } from "#/shared/config/env";
import { ThemeProvider } from "#/shared/theme/theme-provider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="tanstack-router-clerk-boilerplate-theme"
    >
      <ClerkProvider
        publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
        routerPush={clerkRouterPush}
        routerReplace={clerkRouterReplace}
        afterSignOutUrl="/"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
