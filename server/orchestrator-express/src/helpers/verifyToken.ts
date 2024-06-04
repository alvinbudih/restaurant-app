import { verify } from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET!;

export default function verifyToken(token: string) {
  return verify(token, secretKey);
}
