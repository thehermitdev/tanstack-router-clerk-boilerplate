import { z } from "zod";

import { httpClient } from "#/shared/api/http-client";
import { ApplicationError } from "#/shared/errors/application-error";

import { contactsListResponseSchema } from "./contracts";
import type { ContactsListResponse } from "./contracts";

export interface GetContactsInput {
  limit: number;
  signal?: AbortSignal | undefined;
}

export async function getContacts({
  limit,
  signal,
}: GetContactsInput): Promise<ContactsListResponse> {
  const response = await httpClient.get("/users", {
    params: {
      limit,
      skip: 0,
    },
    ...(signal === undefined ? {} : { signal }),
  });

  try {
    return contactsListResponseSchema.parse(response.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApplicationError("The contacts API returned an invalid response", {
        code: "API_CONTRACT_ERROR",
        details: z.treeifyError(error),
        cause: error,
      });
    }

    throw error;
  }
}
