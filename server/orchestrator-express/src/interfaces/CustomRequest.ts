import { Request } from "express";
import PayloadToken from "./PayloadToken";

export default interface CustomRequest extends Request {
  user: PayloadToken;
}
