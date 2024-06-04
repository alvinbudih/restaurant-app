import express from "express";
import PublicController from "../controllers/public-controller";

const pub = express.Router();

pub.get("/users/:id", PublicController.getUserById);

export default pub;
