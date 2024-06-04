import express from "express";
import UserController from "../controllers/user-controller";

const user = express.Router();

user.get("/", UserController.getAll);

user.get("/:id", UserController.getById);

export default user;
