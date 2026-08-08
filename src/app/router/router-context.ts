import type { QueryClient } from "@tanstack/react-query";

import type { AppAuth } from "#/app/auth/auth";

export interface RouterContext {
  queryClient: QueryClient;
  auth: AppAuth;
}
