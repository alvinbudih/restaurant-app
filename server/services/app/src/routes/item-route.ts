import express from "express";
import ItemController from "../controllers/item-controller";

const item = express.Router();

item.get("/", ItemController.getAll);

item.post("/", ItemController.create);

item.get("/:id", ItemController.getById);

item.patch("/:id", ItemController.update);

item.delete("/:id", ItemController.destroy);

export default item;
