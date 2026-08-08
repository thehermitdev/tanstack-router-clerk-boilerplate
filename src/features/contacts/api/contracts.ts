import { z } from "zod";

export const contactSchema = z.object({
  id: z.number().int().positive(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  image: z.url(),
  role: z.enum(["admin", "moderator", "user"]),
  company: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
  }),
});

export const contactsListResponseSchema = z.object({
  users: z.array(contactSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
});

export type Contact = z.infer<typeof contactSchema>;
export type ContactsListResponse = z.infer<typeof contactsListResponseSchema>;
