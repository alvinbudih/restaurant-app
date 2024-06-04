import { ZodSchema } from "zod";

export default function validate<T>(schema: ZodSchema, data: T): T {
  return schema.parse(data);
}
