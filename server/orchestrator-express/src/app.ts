import "dotenv/config";
import express from "express";
import cors from "cors";
import auth from "./routes/auth";
import errorHandler from "./middlewares/errorHandler";
import isAuthentiecated from "./middlewares/isAuthenticated";
import user from "./routes/user";
import category from "./routes/category";
import item from "./routes/item";
import pub from "./routes/public";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth);
app.use("/public", pub);

app.use(isAuthentiecated);
app.use("/users", user);
app.use("/categories", category);
app.use("/items", item);

app.use(errorHandler);

app.listen(port, () => {
  console.clear();
  console.log(`Main Server listening on ${port}`);
});
