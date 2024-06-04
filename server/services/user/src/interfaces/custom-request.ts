import { Request } from "express";
import PayloadToken from "./payload-token";

export default interface CustomRequest extends Request {
  user: PayloadToken;
}
