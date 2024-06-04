import express from "express";
import CategoryController from "../controllers/category-controller";

const category = express.Router();

category.get("/", CategoryController.getAll);

category.post("/", CategoryController.create);

category.get("/:id", CategoryController.getById);

category.patch("/:id", CategoryController.update);

category.delete("/:id", CategoryController.destroy);

export default category;
