import "dotenv/config";
import "./config/mongoose";
import express from "express";
import cors from "cors";
import "dotenv/config";
import user from "./routes/user";
import auth from "./routes/auth";
import errorHandler from "./middlewares/errorHandler";
import isAuthenticated from "./middlewares/isAuthenticated";
import pub from "./routes/pub";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth);
app.use("/public", pub);

app.use(isAuthenticated);
app.use("/users", user);

app.use(errorHandler);

app.listen(port, () => {
  console.clear();
  console.log(`User Server listening on ${port}`);
});
