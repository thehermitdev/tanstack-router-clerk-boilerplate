import type { Contact } from "../api/contracts";

interface ContactsTableProps {
  contacts: Contact[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {contacts.map((contact) => (
              <tr key={contact.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={contact.image}
                      alt=""
                      className="size-9 rounded-full border bg-muted object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {contact.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-muted-foreground">
                  {contact.role}
                </td>
                <td className="px-4 py-3">
                  <p className="max-w-56 truncate font-medium">
                    {contact.company.name}
                  </p>
                  <p className="max-w-56 truncate text-xs text-muted-foreground">
                    {contact.company.title}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {contact.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
