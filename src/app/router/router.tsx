import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import type { AppAuth } from "#/app/auth/auth";
import { queryClient } from "#/app/query-client/query-client";
import { routeTree } from "#/routeTree.gen";

const initialAuth: AppAuth = {
  isLoaded: false,
  isSignedIn: false,
  userId: null,
};

export const router = createTanStackRouter({
  routeTree,
  context: {
    queryClient,
    auth: initialAuth,
  },
  scrollRestoration: true,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
