import { useMemo } from "react";
import { useAuth } from "@clerk/react";

import type { AppAuth } from "./auth";

export function useAppAuth(): AppAuth {
  const { isLoaded, isSignedIn, userId } = useAuth();

  return useMemo(
    () => ({
      isLoaded,
      isSignedIn: isSignedIn === true,
      userId: userId ?? null,
    }),
    [isLoaded, isSignedIn, userId],
  );
}
