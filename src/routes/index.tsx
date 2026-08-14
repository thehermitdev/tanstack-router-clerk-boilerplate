import { SignInButton, SignUpButton } from "@clerk/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowRight, LayoutDashboard, LockKeyhole, Users } from "lucide-react";

import { Button } from "#/shared/components/ui/button";
import { ModeToggle } from "#/shared/theme/mode-toggle";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.isSignedIn) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [{ title: "TanStack Router Clerk Boilerplate" }],
  }),
  component: WelcomePage,
});

const features = [
  {
    icon: LockKeyhole,
    title: "Authentication ready",
    description: "Clerk is wired at the application boundary and available everywhere.",
  },
  {
    icon: LayoutDashboard,
    title: "Protected dashboard",
    description: "TanStack Router guards authenticated routes before page rendering.",
  },
  {
    icon: Users,
    title: "Server state example",
    description: "TanStack Query loads and caches contacts from the DummyJSON API.",
  },
];

function WelcomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_36%),radial-gradient(circle_at_80%_20%,color-mix(in_oklch,var(--muted-foreground)_10%,transparent),transparent_30%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 lg:px-8">
        <header className="flex h-20 items-center justify-between border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <LayoutDashboard className="size-4" aria-hidden="true" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold tracking-tight">TanStack + Clerk</p>
              <p className="text-xs text-muted-foreground">SPA Boilerplate</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <SignInButton
              mode="modal"
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
            >
              <Button variant="ghost">Sign in</Button>
            </SignInButton>
            <SignUpButton
              mode="modal"
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
            >
              <Button>Sign up</Button>
            </SignUpButton>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <span className="size-1.5 rounded-full bg-primary" />
              Production-oriented React SPA foundation
            </div>

            <h1 className="font-heading text-5xl leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
              Start with architecture,
              <span className="text-muted-foreground"> not authentication plumbing.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              A focused TanStack Router boilerplate with Clerk authentication, TanStack Query server
              state, runtime validation, Tailwind CSS, and shadcn/ui primitives already composed at
              the correct boundaries.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <SignUpButton
                mode="modal"
                forceRedirectUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
              >
                <Button size="lg">
                  Create account
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </SignUpButton>

              <SignInButton
                mode="modal"
                forceRedirectUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
              >
                <Button variant="outline" size="lg">
                  Open dashboard
                </Button>
              </SignInButton>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-[2.5rem] bg-primary/5 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border bg-card/90 p-2 shadow-2xl shadow-foreground/5 backdrop-blur">
              <div className="rounded-[0.75rem] border bg-background p-6 sm:p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Application foundation</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Minimal surface, clear ownership
                    </p>
                  </div>
                  <div className="flex gap-1.5" aria-hidden="true">
                    <span className="size-2 rounded-full bg-muted-foreground/25" />
                    <span className="size-2 rounded-full bg-muted-foreground/25" />
                    <span className="size-2 rounded-full bg-muted-foreground/25" />
                  </div>
                </div>

                <div className="space-y-3">
                  {features.map(({ icon: Icon, title, description }) => (
                    <div
                      key={title}
                      className="flex gap-4 rounded-2xl border bg-card p-4 shadow-xs"
                    >
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted">
                        <Icon className="size-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 py-6 text-xs text-muted-foreground">
          <p>Built for TanStack Router + React + Clerk.</p>
          <p>Authentication is enforced again at your backend API boundary.</p>
        </footer>
      </div>
    </main>
  );
}
