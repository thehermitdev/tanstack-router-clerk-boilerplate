export type ApplicationErrorCode =
  "HTTP_ERROR" | "NETWORK_ERROR" | "API_CONTRACT_ERROR" | "UNKNOWN_ERROR";

interface ApplicationErrorOptions {
  code: ApplicationErrorCode;
  status?: number;
  details?: unknown;
  cause?: unknown;
}

export class ApplicationError extends Error {
  readonly code: ApplicationErrorCode;
  readonly status?: number;
  readonly details?: unknown;

  constructor(message: string, options: ApplicationErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "ApplicationError";
    this.code = options.code;

    if (options.status !== undefined) {
      this.status = options.status;
    }

    if (options.details !== undefined) {
      this.details = options.details;
    }
  }
}
