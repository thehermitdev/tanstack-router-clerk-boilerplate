# TanStack Router Clerk Boilerplate

A focused client-rendered React SPA starter built with Bun, TanStack Router, TanStack Query, Clerk, Axios, Zod, Tailwind CSS v4, and shadcn/ui primitives.

## Included

- Clerk authentication at the application provider boundary
- Modal sign-in and sign-up from the public welcome page
- Protected `/dashboard` and `/contacts` routes
- TanStack Router file-based routing with `(protected)` route groups
- TanStack Query server-state caching and route-level prefetching
- DummyJSON contacts example with Zod runtime validation
- Shared Axios transport with normalized application errors
- Light, dark, and system theme support
- A compact dashboard adapted from the structure of shadcn/ui `dashboard-01`

## Routes

```text
/
├── Welcome page
│   ├── Sign in modal
│   └── Sign up modal
│
├── /dashboard   protected
└── /contacts    protected
```

The physical route structure is:

```text
src/routes/
├── __root.tsx
├── index.tsx
└── (protected)/
    ├── dashboard/
    │   └── index.tsx
    └── contacts/
        └── index.tsx
```

The `(protected)` directory is a TanStack Router route group. It organizes files without adding a URL segment.

## Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure your Clerk publishable key:

```dotenv
VITE_APP_NAME=TanStack Router Clerk Boilerplate
VITE_API_BASE_URL=https://dummyjson.com
VITE_API_TIMEOUT_MS=15000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

Only use a Clerk **publishable** key in `VITE_*` variables. Never expose Clerk secret keys or backend credentials in browser environment variables.

## Install

```bash
bun install
```

The dependency lockfile should be generated from the updated `package.json` after cloning this revision.

## Development

```bash
bun run dev
```

Open:

```text
http://localhost:3000
```

## Quality checks

```bash
bun run format:check
bun run lint
bun run typecheck
bun run build
```

Or run all checks:

```bash
bun run check
```

## Source architecture

```text
src/
├── app/
│   ├── auth/
│   ├── providers/
│   ├── query-client/
│   └── router/
├── routes/
├── features/
│   ├── contacts/
│   └── dashboard/
├── shared/
│   ├── api/
│   ├── components/
│   ├── config/
│   ├── errors/
│   ├── lib/
│   └── theme/
└── styles/
```

Dependency intent remains simple:

```text
application composition → routes → features → shared infrastructure
```

Clerk-specific provider and user UI integration stays under `src/app`. Feature API data stays behind feature contracts and the shared HTTP transport.

## Authentication boundary

Client-side route protection improves navigation and UX, but it is not the final security boundary. Any real private backend API must independently verify the Clerk session or token and enforce authorization on the server.

## Dashboard example

The dashboard follows the composition used by shadcn/ui `dashboard-01`—application sidebar, site header, section cards, visualization, and data table—but removes unnecessary navigation groups and chart dependencies for a smaller starter surface.

The sidebar intentionally contains only:

- Overview
- Contacts

The dashboard and contacts screens load sample contact data from DummyJSON.
