import { Link } from "@tanstack/react-router";
import { LayoutDashboard, UsersRound } from "lucide-react";

const navigation = [
  {
    label: "Overview",
    to: "/dashboard" as const,
    icon: LayoutDashboard,
  },
  {
    label: "Contacts",
    to: "/contacts" as const,
    icon: UsersRound,
  },
];

export function AppSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r bg-card/60 md:flex md:flex-col">
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
          <LayoutDashboard className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold">Workspace</p>
          <p className="truncate text-xs text-muted-foreground">TanStack + Clerk</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main navigation">
        {navigation.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{
              className:
                "bg-muted text-foreground shadow-xs ring-1 ring-foreground/5",
            }}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4 text-xs leading-5 text-muted-foreground">
        Protected by Clerk and TanStack Router.
      </div>
    </aside>
  );
}
