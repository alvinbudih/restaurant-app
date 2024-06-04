import "dotenv/config";
import express from "express";
import cors from "cors";
import category from "./routes/category-route";
import errorHandler from "./middlewares/errorHandler";
import item from "./routes/item-route";

const app = express();
const port = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/categories", category);
app.use("/items", item);

app.use(errorHandler);

app.listen(port, () => {
  console.clear();
  console.log(`App Server listening on ${port}`);
});
