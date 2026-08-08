import z from "zod";

export const userSchema = z.object({
  id: z.number().int().positive(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  image: z.url(),
  role: z.string().min(1),
});

export const usersListResponseSchema = z.object({
  users: z.array(userSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
});

export type User = z.infer<typeof userSchema>;
export type UsersListResponse = z.infer<typeof usersListResponseSchema>;
