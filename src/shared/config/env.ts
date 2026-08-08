import { z } from "zod";

const envSchema = z.object({
  VITE_APP_NAME: z
    .string()
    .trim()
    .min(1)
    .default("TanStack Router Boilerplate"),
  VITE_API_BASE_URL: z.url().default("https://dummyjson.com"),
  VITE_API_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
});

const result = envSchema.safeParse(import.meta.env);

if (!result.success) {
  console.error(
    "Invalid environment configuration",
    result.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment configuration");
}

export const env = result.data;
