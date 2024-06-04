export type CategoryPayload = {
  id: string;
  name: string;
};

export type CreateCategory = Pick<CategoryPayload, "name">;

export type UpdateCategory = Partial<CreateCategory>;
