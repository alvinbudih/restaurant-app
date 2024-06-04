import express from "express";
import UserController from "../controllers/user-controller";

const auth = express.Router();

auth.post("/register", UserController.register);

auth.post("/login", UserController.login);

export default auth;
