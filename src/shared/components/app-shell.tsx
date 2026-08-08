import { Link } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";

import { env } from "#/shared/config/env";
import { ModeToggle } from "#/shared/theme/mode-toggle";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="font-semibold tracking-tight">
            {env.VITE_APP_NAME}
          </Link>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-4 text-sm sm:flex">
              <Link
                to="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Getting started
              </Link>
              <Link
                to="/users"
                search={{ page: 1, pageSize: 10 }}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Users example
              </Link>
            </nav>
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}
