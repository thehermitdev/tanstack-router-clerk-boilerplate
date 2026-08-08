import z from "zod";

import { usersListResponseSchema } from "./contracts";
import type { UsersListResponse } from "./contracts";
import { httpClient } from "#/shared/api/http-client";
import { ApplicationError } from "#/shared/errors/application-error";

export interface GetUsersInput {
  page: number;
  pageSize: number;
  signal?: AbortSignal | undefined;
}

export async function getUsers({
  page,
  pageSize,
  signal,
}: GetUsersInput): Promise<UsersListResponse> {
  const response = await httpClient.get("/users", {
    params: {
      limit: pageSize,
      skip: (page - 1) * pageSize,
    },
    ...(signal === undefined ? {} : { signal }),
  });

  try {
    return usersListResponseSchema.parse(response.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApplicationError("The users API returned an invalid response", {
        code: "API_CONTRACT_ERROR",
        details: z.treeifyError(error),
        cause: error.cause,
      });
    }

    throw error;
  }
}
