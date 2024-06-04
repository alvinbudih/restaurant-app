import { z } from "zod";

export const ingredientSchema = z.object({
  name: z
    .string({ required_error: "Ingredient name is required" })
    .min(1, "Ingredient name must have at least 1 character")
    .max(255, "Ingredient name is too long"),
});

export type CreateIngredient = z.infer<typeof ingredientSchema>;
