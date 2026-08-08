import { UsersRound } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/shared/components/ui/card";

import type { Contact } from "../api/contracts";
import { ContactsTable } from "../components/contacts-table";

interface ContactsPageProps {
  contacts: Contact[];
  total: number;
}

export function ContactsPage({ contacts, total }: ContactsPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Directory</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
          Contacts
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Contact data is loaded from DummyJSON through the shared HTTP client and cached by TanStack Query.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-muted">
              <UsersRound className="size-4" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Contact directory</CardTitle>
              <CardDescription>
                Showing {contacts.length} of {total} available contacts.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ContactsTable contacts={contacts} />
        </CardContent>
      </Card>
    </div>
  );
}
