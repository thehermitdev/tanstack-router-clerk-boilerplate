import {
  Blocks,
  CheckCircle2,
  FileCog,
  GitPullRequestArrow,
  PackageCheck,
  SearchCode,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/components/ui/card";

interface SetupStep {
  command?: string;
  description: string;
  icon: LucideIcon;
  tasks: Array<string>;
  title: string;
}

const setupSteps: Array<SetupStep> = [
  {
    icon: FileCog,
    title: "Configure project identity",
    description:
      "Replace the template defaults before building application-specific features.",
    command: "cp .env.example .env",
    tasks: [
      "Update the package name and repository metadata.",
      "Set VITE_APP_NAME and VITE_API_BASE_URL in .env.",
      "Never place secrets in VITE_* environment variables.",
    ],
  },
  {
    icon: PackageCheck,
    title: "Install and lock dependencies",
    description:
      "Create the dependency graph owned by the repository generated from this template.",
    command: "bun install",
    tasks: [
      "Review the generated bun.lock file.",
      "Commit bun.lock with the project initialization changes.",
      "Use bun install --frozen-lockfile in CI after the lockfile exists.",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Verify the baseline",
    description:
      "Prove that the untouched starter is healthy before adding business code.",
    command: "bun run check && bun run test:e2e",
    tasks: [
      "Formatting, linting, typecheck, unit tests, and production build must pass.",
      "Playwright validates the browser workflow independently.",
      "Resolve baseline failures before starting the first feature.",
    ],
  },
  {
    icon: SearchCode,
    title: "Study the users reference feature",
    description:
      "Use the existing feature as the executable example of the architecture.",
    tasks: [
      "Follow the flow from route search validation to queryOptions.",
      "Inspect Axios transport and Zod response validation at the API boundary.",
      "Review loading, error, empty, and success states on the page.",
    ],
  },
  {
    icon: Blocks,
    title: "Build the first real feature",
    description:
      "Copy the pattern, not the sample domain, and keep dependency direction intact.",
    command: "src/features/your-feature/{api,components,model,pages}",
    tasks: [
      "Expose a small public API through the feature index.ts file.",
      "Keep routes focused on validation, prefetching, and page composition.",
      "Keep reusable shadcn primitives free of business rules.",
    ],
  },
  {
    icon: GitPullRequestArrow,
    title: "Open a focused pull request",
    description:
      "Ship the feature with tests, documentation, and a reviewable change set.",
    command: "git switch -c feat/your-feature",
    tasks: [
      "Run the full quality gate before pushing.",
      "Document new conventions or intentional architecture exceptions.",
      "Require CI status checks before merging into main.",
    ],
  },
];

export function SetupTimeline() {
  return (
    <ol className="relative mx-auto max-w-4xl">
      {setupSteps.map(
        ({ command, description, icon: Icon, tasks, title }, index) => (
          <li key={title} className="relative pb-8 pl-12 last:pb-0 sm:pl-16">
            {index < setupSteps.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-10 bottom-0 left-[1.15rem] w-px bg-border sm:left-[1.65rem]"
              />
            ) : null}

            <span className="absolute top-1 left-0 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-background sm:size-12">
              <Icon className="size-5" />
            </span>

            <Card className="transition-transform duration-200 hover:-translate-y-0.5">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  <span className="rounded-full bg-muted px-2 py-1">
                    Step {index + 1}
                  </span>
                </div>
                <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
                <CardDescription className="max-w-2xl leading-6">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {command ? (
                  <pre className="overflow-x-auto rounded-lg border bg-muted/60 px-4 py-3 font-jetbrains-mono text-xs text-foreground sm:text-sm">
                    <code>{command}</code>
                  </pre>
                ) : null}

                <ul className="grid gap-2 text-sm text-muted-foreground">
                  {tasks.map((task) => (
                    <li key={task} className="flex gap-2 leading-6">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </li>
        ),
      )}
    </ol>
  );
}
