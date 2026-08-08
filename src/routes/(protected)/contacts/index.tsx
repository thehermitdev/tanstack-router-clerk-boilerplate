import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { AppUserMenu } from "#/app/auth/user-menu";
import { ContactsPage, contactsListQueryOptions } from "#/features/contacts";
import { DashboardShell } from "#/features/dashboard";
import { Button } from "#/shared/components/ui/button";

const contactsLimit = 30;

export const Route = createFileRoute("/(protected)/contacts/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({ to: "/" });
    }
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(contactsListQueryOptions(contactsLimit)),
  pendingComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background">
      <p className="text-sm text-muted-foreground">Loading contacts…</p>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="font-heading text-2xl font-semibold">Could not load contacts</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  ),
  head: () => ({
    meta: [{ title: "Contacts · TanStack Router Clerk Boilerplate" }],
  }),
  component: ContactsRoute,
});

function ContactsRoute() {
  const { data } = useSuspenseQuery(contactsListQueryOptions(contactsLimit));

  return (
    <DashboardShell title="Contacts" userMenu={<AppUserMenu />}>
      <ContactsPage contacts={data.users} total={data.total} />
    </DashboardShell>
  );
}
