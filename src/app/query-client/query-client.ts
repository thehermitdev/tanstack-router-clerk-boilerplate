import { QueryClient } from "@tanstack/react-query";

import { ApplicationError } from "#/shared/errors/application-error";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        if (
          error instanceof ApplicationError &&
          error.status &&
          error.status < 500
        ) {
          return false;
        }

        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
