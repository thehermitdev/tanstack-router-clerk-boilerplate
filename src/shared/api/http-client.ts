import axios from "axios";

import { env } from "#/shared/config/env";
import { ApplicationError } from "#/shared/errors/application-error";

export const httpClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(
        new ApplicationError("An unexpected error occurred", {
          code: "UNKNOWN_ERROR",
          cause: error,
        }),
      );
    }

    if (!error.response) {
      return Promise.reject(
        new ApplicationError("The API could not be reached", {
          code: "NETWORK_ERROR",
          cause: error,
        }),
      );
    }

    return Promise.reject(
      new ApplicationError(error.message, {
        code: "HTTP_ERROR",
        status: error.response.status,
        details: error.response.data,
        cause: error,
      }),
    );
  },
);
