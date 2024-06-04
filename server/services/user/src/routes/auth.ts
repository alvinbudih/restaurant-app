import express from "express";
import AuthController from "../controllers/auth-controller";

const auth = express.Router();

auth.post("/register", AuthController.register);

auth.post("/login", AuthController.login);

export default auth;
