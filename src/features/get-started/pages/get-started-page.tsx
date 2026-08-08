import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  Braces,
  DatabaseZap,
  RouteIcon,
  ShieldCheck,
} from "lucide-react";

import { SetupTimeline } from "../components/setup-timeline";
import { Button } from "#/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/components/ui/card";

const guardrails = [
  {
    icon: DatabaseZap,
    title: "Query owns server state",
    description:
      "Do not copy API data into Context or local stores without a documented reason.",
  },
  {
    icon: ShieldCheck,
    title: "Validate every boundary",
    description:
      "Environment variables, URL search values, and API responses are parsed at runtime.",
  },
  {
    icon: RouteIcon,
    title: "Routes orchestrate",
    description:
      "Routes validate, prefetch, and compose. Feature code owns the business capability.",
  },
  {
    icon: Braces,
    title: "Shared stays independent",
    description:
      "Shared infrastructure and UI never import routes or feature implementations.",
  },
];

export function GetStartedPage() {
  return (
    <div className="space-y-16 pb-10">
      <section className="relative isolate overflow-hidden rounded-3xl border bg-card px-6 py-12 shadow-sm sm:px-10 sm:py-16">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-48 bg-linear-to-b from-primary/10 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 -z-10 size-64 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border bg-background/80 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase shadow-xs">
            First-run onboarding
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Start with a clean baseline. Keep the architecture intact.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            This page is the recommended path after running{" "}
            <code>bun run dev</code>. Complete the timeline before replacing the
            reference feature with your application domain.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              nativeButton={false}
              size="lg"
              render={
                <a href="#setup-timeline">
                  Follow the setup timeline
                  <ArrowRight data-icon="inline-end" />
                </a>
              }
            />
            <Button
              nativeButton={false}
              variant="outline"
              size="lg"
              render={
                <Link to="/users" search={{ page: 1, pageSize: 10 }}>
                  Open users reference
                  <BookOpenCheck data-icon="inline-end" />
                </Link>
              }
            />
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Detailed team guidance is available in{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-jetbrains-mono text-xs text-foreground">
              docs/GETTING_STARTED.th.md
            </code>
            .
          </p>
        </div>
      </section>

      <section id="setup-timeline" className="scroll-mt-24 space-y-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-primary">
            Recommended sequence
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your first hour with the template
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Each step produces a verifiable outcome and reduces uncertainty
            before feature work begins.
          </p>
        </div>

        <SetupTimeline />
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">
            Architecture guardrails
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Rules worth preserving
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {guardrails.map(({ description, icon: Icon, title }) => (
            <Card key={title} size="sm">
              <CardHeader>
                <span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="leading-6">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <Card className="bg-primary text-primary-foreground ring-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">
            Ready to build the first feature?
          </CardTitle>
          <CardDescription className="max-w-2xl text-primary-foreground/75">
            Keep the users module until your first production feature covers
            contracts, queries, route orchestration, UI states, and tests end to
            end.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            nativeButton={false}
            variant="secondary"
            size="lg"
            render={
              <Link to="/users" search={{ page: 1, pageSize: 10 }}>
                Inspect the reference implementation
                <ArrowRight data-icon="inline-end" />
              </Link>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
