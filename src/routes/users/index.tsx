import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { UsersPage, usersListQueryOptions } from "#/features/users";
import { Button } from "#/shared/components/ui/button";

const usersSearchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(5).max(50).catch(10),
});

export const Route = createFileRoute("/users/")({
  validateSearch: (search) => usersSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(usersListQueryOptions(deps)),
  pendingComponent: () => (
    <p className="py-12 text-muted-foreground">Loading users…</p>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="space-y-4 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <h1 className="font-semibold">Could not load users</h1>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  ),
  component: UsersRoute,
  head: () => ({
    meta: [{ title: "Users Example" }],
  }),
});

function UsersRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data } = useSuspenseQuery(usersListQueryOptions(search));

  return (
    <UsersPage
      data={data}
      page={search.page}
      pageSize={search.pageSize}
      onPageChange={(page) => {
        void navigate({ search: (previous) => ({ ...previous, page }) });
      }}
    />
  );
}
