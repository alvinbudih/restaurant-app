import { compareSync, hashSync } from "bcryptjs";
import CustomError from "../helpers/custom-error";
import validate from "../helpers/validate";
import User from "../models/user";
import {
  LoginPayload,
  RegisterPayload,
  loginSchema,
  userSchema,
} from "../schemas/user-schema";
import signToken from "../helpers/signToken";

export default class UserService {
  static async register(body: RegisterPayload) {
    const payload = validate(userSchema, body);

    const user = await User.findOne({ email: payload.email });

    if (user) {
      throw new CustomError("User is registered", 400);
    }

    payload.password = hashSync(payload.password);

    return await User.create(payload);
  }

  static async login(body: LoginPayload) {
    const payload = validate(loginSchema, body);

    const user = await User.findOne({ email: payload.email });

    if (!user || !compareSync(payload.password, user.password!)) {
      throw new CustomError("Invalid Email or Password", 400);
    }

    return {
      token: signToken({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }),
    };
  }

  static async findAll() {
    return await User.find().exec();
  }

  static async findById(id: string) {
    const user = await User.findById(id);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return user;
  }
}
