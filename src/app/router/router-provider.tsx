import { useEffect, useRef } from "react";
import { RouterProvider } from "@tanstack/react-router";

import { useAppAuth } from "#/app/auth/clerk-auth";
import { queryClient } from "#/app/query-client/query-client";

import { router } from "./router";

export function AppRouterProvider() {
  const auth = useAppAuth();
  const previousUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!auth.isLoaded) {
      return;
    }

    const previousUserId = previousUserIdRef.current;

    if (previousUserId !== undefined && previousUserId !== auth.userId) {
      queryClient.clear();
    }

    previousUserIdRef.current = auth.userId;
    void router.invalidate();
  }, [auth.isLoaded, auth.userId]);

  if (!auth.isLoaded) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-muted-foreground">Loading application…</p>
      </div>
    );
  }

  return (
    <RouterProvider
      router={router}
      context={{
        queryClient,
        auth,
      }}
    />
  );
}
