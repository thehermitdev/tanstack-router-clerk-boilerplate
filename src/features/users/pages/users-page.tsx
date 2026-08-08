import { UsersTable } from "../components/users-table";
import type { UsersListResponse } from "../api/contracts";
import { Button } from "#/shared/components/ui/button";
import { Card } from "#/shared/components/ui/card";

interface UsersPageProps {
  data: UsersListResponse;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function UsersPage({
  data,
  page,
  pageSize,
  onPageChange,
}: UsersPageProps) {
  const lastPage = Math.max(1, Math.ceil(data.total / pageSize));

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Reference feature</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Users</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          This route demonstrates Router loader orchestration, TanStack Query
          caching, Axios transport, and Zod contract validation.
        </p>
      </div>

      <Card className="space-y-4 ring-0 pt-0 shadow-none">
        <UsersTable users={data.users} />
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {lastPage} · {data.total} records
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= lastPage}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
