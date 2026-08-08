import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/components/ui/card";

interface RoleDistributionProps {
  admin: number;
  moderator: number;
  user: number;
}

export function RoleDistribution({ admin, moderator, user }: RoleDistributionProps) {
  const total = Math.max(admin + moderator + user, 1);
  const rows = [
    { label: "User", value: user },
    { label: "Moderator", value: moderator },
    { label: "Admin", value: admin },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role distribution</CardTitle>
        <CardDescription>
          Lightweight dashboard visualization without an additional chart dependency.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {rows.map((row) => {
          const percentage = Math.round((row.value / total) * 100);

          return (
            <div key={row.label} className="space-y-2">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium">{row.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {row.value} · {percentage}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
