import type { ReactNode } from "react";

import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";

interface DashboardShellProps {
  title: string;
  userMenu: ReactNode;
  children: ReactNode;
}

export function DashboardShell({
  title,
  userMenu,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-muted/20 md:flex">
      <AppSidebar />

      <div className="min-w-0 flex-1">
        <SiteHeader title={title} userMenu={userMenu} />
        <main className="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
