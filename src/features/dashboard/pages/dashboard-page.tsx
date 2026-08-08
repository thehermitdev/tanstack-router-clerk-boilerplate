import type { ReactNode } from "react";

import { ContactsPreview } from "../components/contacts-preview";
import type { DashboardContact } from "../components/contacts-preview";
import { DashboardShell } from "../components/dashboard-shell";
import { RoleDistribution } from "../components/role-distribution";
import { SectionCards } from "../components/section-cards";

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
    <DashboardShell title="Overview" userMenu={userMenu}>
      <div className="flex flex-col gap-6">
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
      </div>
    </DashboardShell>
  );
}
