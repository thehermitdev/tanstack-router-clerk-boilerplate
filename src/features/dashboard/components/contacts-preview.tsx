import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { buttonVariants } from "#/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/components/ui/card";

export interface DashboardContact {
  id: number;
  name: string;
  email: string;
  image: string;
  company: string;
  title: string;
  role: "admin" | "moderator" | "user";
}

interface ContactsPreviewProps {
  contacts: DashboardContact[];
}

export function ContactsPreview({ contacts }: ContactsPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent contacts</CardTitle>
        <CardDescription>
          A live preview of contacts returned by DummyJSON.
        </CardDescription>
        <CardAction>
          <Link
            to="/contacts"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View all
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {contacts.slice(0, 6).map((contact) => (
                  <tr key={contact.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={contact.image}
                          alt=""
                          className="size-9 rounded-full border bg-muted object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{contact.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-52 truncate font-medium">{contact.company}</p>
                      <p className="max-w-52 truncate text-xs text-muted-foreground">
                        {contact.title}
                      </p>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">
                      {contact.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
