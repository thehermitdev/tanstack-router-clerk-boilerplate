import type { ReactNode } from "react";

import { AppSidebar } from "../components/app-sidebar";
import { ContactsPreview } from "../components/contacts-preview";
import type { DashboardContact } from "../components/contacts-preview";
import { RoleDistribution } from "../components/role-distribution";
import { SectionCards } from "../components/section-cards";
import { SiteHeader } from "../components/site-header";

interface DashboardPageProps {
  contacts: DashboardContact[];
  totalContacts: number;
  userMenu: ReactNode;
}

export function DashboardPage({
  contacts,
  totalContacts,
  userMenu,
}: DashboardPageProps) {
  const roles = contacts.reduce(
    (accumulator, contact) => {
      accumulator[contact.role] += 1;
      return accumulator;
    },
    { admin: 0, moderator: 0, user: 0 },
  );

  return (
    <div className="min-h-screen bg-muted/20 md:flex">
      <AppSidebar />

      <div className="min-w-0 flex-1">
        <SiteHeader title="Overview" userMenu={userMenu} />

        <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 md:p-6 lg:p-8">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
            <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
              Overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              A compact adaptation of shadcn/ui dashboard-01 using the application&apos;s existing primitives and DummyJSON contacts.
            </p>
          </div>

          <SectionCards
            totalContacts={totalContacts}
            visibleContacts={contacts.length}
            adminContacts={roles.admin}
          />

          <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
            <RoleDistribution
              admin={roles.admin}
              moderator={roles.moderator}
              user={roles.user}
            />
            <ContactsPreview contacts={contacts} />
          </div>
        </main>
      </div>
    </div>
  );
}
