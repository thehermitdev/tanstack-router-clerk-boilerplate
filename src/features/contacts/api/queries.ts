import { queryOptions } from "@tanstack/react-query";

import { getContacts } from "./client";

export const contactsKeys = {
  all: ["contacts"] as const,
  lists: () => [...contactsKeys.all, "list"] as const,
  list: (limit: number) => [...contactsKeys.lists(), { limit }] as const,
};

export function contactsListQueryOptions(limit: number) {
  return queryOptions({
    queryKey: contactsKeys.list(limit),
    queryFn: ({ signal }) => getContacts({ limit, signal }),
    staleTime: 60_000,
  });
}
