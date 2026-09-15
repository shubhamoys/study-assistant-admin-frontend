import { z } from "zod";

// Mirrors CreateCategoryInput/UpdateCategoryInput — no `slug` field, it's
// always derived server-side from `name`.
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be at most 100 characters long"),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters long")
    .optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
