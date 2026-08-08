# Engineering Rules

This repository is a production-oriented client-rendered React SPA starter. Preserve these constraints when generating or changing code.

1. `src/app` owns application composition such as Clerk, QueryClient, and Router providers.
2. Routes orchestrate authentication checks, URL state, prefetching, and feature-page composition. Do not place API transport logic in route files.
3. TanStack Query owns server state. Do not copy query data into global client stores without a documented reason.
4. Only `src/shared/api/http-client.ts` may import Axios directly.
5. Validate untrusted boundaries with Zod, including API responses and environment variables.
6. `src/shared` must never import from `src/features`, `src/routes`, or `src/app`.
7. Features expose a narrow public API through `index.ts`; avoid deep-importing private feature implementation.
8. UI primitives contain no domain behavior. Feature-specific UI remains inside its feature.
9. Clerk secret keys and privileged credentials must never be exposed through `VITE_*` browser variables.
10. Client-side route guards are not backend authorization. Private APIs must validate authentication and authorization server-side.
11. Generated `src/routeTree.gen.ts` must not be edited or committed.
12. A change is complete when formatting, linting, typechecking, and production build checks pass.
