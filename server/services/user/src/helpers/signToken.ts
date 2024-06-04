import { sign } from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET!;

export default function signToken(payload: any) {
  return sign(payload, secretKey, { expiresIn: "1d" });
}
