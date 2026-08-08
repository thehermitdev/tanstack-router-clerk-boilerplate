# Engineering Rules

This repository is a production-oriented SPA starter. Preserve these constraints when generating or changing code.

1. Routes orchestrate search validation, authorization checks, prefetching, and page composition. Do not place API transport or business logic in route files.
2. TanStack Query owns server state. Do not copy query data into global client stores without a documented reason.
3. Only `src/shared/api/http-client.ts` may import Axios directly.
4. Validate every untrusted boundary with Zod: API responses, environment variables, URL search values, storage, and messages.
5. `src/shared` must never import from `src/features`, `src/routes`, or `src/app`.
6. A feature exposes a narrow public API through `index.ts`; other modules must not deep-import private feature files.
7. UI primitives contain no domain behavior. Feature-specific UI remains inside its feature.
8. Add tests at the lowest useful layer and use MSW for network-level integration tests.
9. Generated `src/routeTree.gen.ts` must not be edited or committed.
10. A change is complete only when format, lint, typecheck, tests, and build pass.