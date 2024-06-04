import express from "express";
import PublicController from "../controllers/public-controller";

const pub = express.Router();

pub.get("/categories", PublicController.listCategory);

pub.get("/categories/:id", PublicController.getCategoryById);

pub.get("/items", PublicController.listItem);

pub.get("/items/:id", PublicController.getItemById);

export default pub;
