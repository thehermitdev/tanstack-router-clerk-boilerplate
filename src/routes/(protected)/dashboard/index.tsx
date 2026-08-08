import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { AppUserMenu } from "#/app/auth/user-menu";
import { contactsListQueryOptions } from "#/features/contacts";
import { DashboardPage } from "#/features/dashboard";
import type { DashboardContact } from "#/features/dashboard";
import { Button } from "#/shared/components/ui/button";

const dashboardContactsLimit = 12;

export const Route = createFileRoute("/(protected)/dashboard/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({ to: "/" });
    }
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      contactsListQueryOptions(dashboardContactsLimit),
    ),
  pendingComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background">
      <p className="text-sm text-muted-foreground">Loading dashboard…</p>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="font-heading text-2xl font-semibold">Could not load dashboard</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  ),
  head: () => ({
    meta: [{ title: "Dashboard · TanStack Router Clerk Boilerplate" }],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  const { data } = useSuspenseQuery(
    contactsListQueryOptions(dashboardContactsLimit),
  );

  const contacts: DashboardContact[] = data.users.map((contact) => ({
    id: contact.id,
    name: `${contact.firstName} ${contact.lastName}`,
    email: contact.email,
    image: contact.image,
    company: contact.company.name,
    title: contact.company.title,
    role: contact.role,
  }));

  return (
    <DashboardPage
      contacts={contacts}
      totalContacts={data.total}
      userMenu={<AppUserMenu />}
    />
  );
}
