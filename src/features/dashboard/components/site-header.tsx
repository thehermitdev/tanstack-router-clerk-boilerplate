import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, UsersRound } from "lucide-react";

import { ModeToggle } from "#/shared/theme/mode-toggle";

interface SiteHeaderProps {
  title: string;
  userMenu: ReactNode;
}

export function SiteHeader({ title, userMenu }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground md:hidden">
          <LayoutDashboard className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold md:text-base">{title}</p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            TanStack Router Clerk Boilerplate
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <nav className="mr-1 flex items-center gap-1 md:hidden" aria-label="Mobile navigation">
          <Link
            to="/dashboard"
            activeOptions={{ exact: true }}
            aria-label="Overview"
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            activeProps={{ className: "bg-muted text-foreground" }}
          >
            <LayoutDashboard className="size-4" aria-hidden="true" />
          </Link>
          <Link
            to="/contacts"
            aria-label="Contacts"
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            activeProps={{ className: "bg-muted text-foreground" }}
          >
            <UsersRound className="size-4" aria-hidden="true" />
          </Link>
        </nav>
        <ModeToggle />
        {userMenu}
      </div>
    </header>
  );
}
