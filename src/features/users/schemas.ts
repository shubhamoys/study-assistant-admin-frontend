import { z } from "zod";

// Mirrors CreateAdminUserInput (src/app-modules/users/dto/create-admin-user.input.ts).
export const addAdminSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(72, "Password must be at most 72 characters long"),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be at most 100 characters long"),
});

export type AddAdminFormValues = z.infer<typeof addAdminSchema>;
