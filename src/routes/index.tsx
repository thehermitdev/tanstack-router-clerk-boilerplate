import { createFileRoute } from "@tanstack/react-router";

import { GetStartedPage } from "#/features/get-started";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Welcome to TanStack Router Boilerplate" }],
  }),
  component: GetStartedPage,
});
