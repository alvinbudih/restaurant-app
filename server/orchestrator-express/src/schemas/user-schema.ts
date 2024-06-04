export type UserPayload = {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  phoneNumber?: string;
  address?: string;
};

export type RegisterPayload = Omit<UserPayload, "_id" | "role">;

export type LoginPayload = Pick<RegisterPayload, "email" | "password">;
