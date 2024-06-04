import { z } from "zod";
import { ingredientSchema } from "./ingredient-schema";

export const itemSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name must have at least 1 character")
    .max(255, "Name is too long"),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description must have at least 1 character")
    .max(255, "Description is too long"),
  price: z.coerce.number({
    invalid_type_error: "Price must be a number",
    required_error: "Price is required",
  }),
  imgUrl: z
    .string({ required_error: "Image  URL is required" })
    .url("Image URL must a valid URL"),
  AuthorId: z.string({ required_error: "Author is required" }),
  CategoryId: z
    .string({ required_error: "Category is required" })
    .uuid("Category must a valid uuid"),
  Ingredients: z
    .array(ingredientSchema, { required_error: "Ingredient is required" })
    .nonempty("Item must have at least 1 Ingredient"),
});

export const itemPartialSchema = itemSchema
  .omit({ Ingredients: true, AuthorId: true })
  .partial();

export type CreateItem = z.infer<typeof itemSchema>;

export type UpdateItem = z.infer<typeof itemPartialSchema>;
