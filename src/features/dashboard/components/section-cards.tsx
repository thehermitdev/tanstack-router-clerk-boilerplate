import { ShieldCheck, UserRoundCheck, UsersRound, Workflow } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/components/ui/card";

interface SectionCardsProps {
  totalContacts: number;
  visibleContacts: number;
  adminContacts: number;
}

const cardClassName = "gap-3";

export function SectionCards({
  totalContacts,
  visibleContacts,
  adminContacts,
}: SectionCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className={cardClassName}>
        <CardHeader>
          <CardDescription>Total contacts</CardDescription>
          <CardTitle className="text-2xl tabular-nums">{totalContacts}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
          <UsersRound className="size-4" aria-hidden="true" />
          DummyJSON directory
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader>
          <CardDescription>Loaded now</CardDescription>
          <CardTitle className="text-2xl tabular-nums">{visibleContacts}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
          <Workflow className="size-4" aria-hidden="true" />
          Cached by TanStack Query
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader>
          <CardDescription>Admin contacts</CardDescription>
          <CardTitle className="text-2xl tabular-nums">{adminContacts}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
          <UserRoundCheck className="size-4" aria-hidden="true" />
          Based on API role
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader>
          <CardDescription>Route access</CardDescription>
          <CardTitle className="text-2xl">Protected</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Clerk + router guard
        </CardContent>
      </Card>
    </div>
  );
}
