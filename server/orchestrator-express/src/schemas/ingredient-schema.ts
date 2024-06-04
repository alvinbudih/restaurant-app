export type IngredientPayload = {
  id: string;
  name: string;
  ItemId: string;
};

export type CreateIngredient = Pick<IngredientPayload, "name">;
