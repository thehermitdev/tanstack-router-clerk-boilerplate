import { queryOptions } from "@tanstack/react-query";
import { getUsers } from "./client";

export interface UsersListQueryInput {
  page: number;
  pageSize: number;
}

export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (input: UsersListQueryInput) => [...usersKeys.lists(), input] as const,
};

export function usersListQueryOptions(input: UsersListQueryInput) {
  return queryOptions({
    queryKey: usersKeys.list(input),
    queryFn: ({ signal }) => getUsers({ ...input, signal }),
    staleTime: 60_000,
  });
}
