import { CategoryPayload } from "./category-schema";
import { CreateIngredient, IngredientPayload } from "./ingredient-schema";
import { UserPayload } from "./user-schema";

export type ItemPayload = {
  id: string;
  name: string;
  description: string;
  price: number;
  imgUrl: string;
  AuthorId: string;
  Author?: UserPayload;
  CategoryId: string;
  Category: CategoryPayload;
  Ingredients: Array<IngredientPayload>;
};

export type CreateItemPayload = {
  name: string;
  description: string;
  price: number;
  imgUrl: string;
  AuthorId: string;
  CategoryId: string;
  Ingredients: Array<CreateIngredient>;
};

export type UpdateItemPayload = Partial<Omit<CreateItemPayload, "Ingredients">>;
