import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name must have at least 1 character")
    .max(255, "Name is too long"),
});

export type CreateCategory = z.infer<typeof categorySchema>;

export const categoryPartialSchema = categorySchema.partial();

export type UpdateCategory = z.infer<typeof categoryPartialSchema>;
