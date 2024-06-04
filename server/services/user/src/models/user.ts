import { Schema, model } from "mongoose";

const schema = new Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  phoneNumber: String,
  address: String,
});

const User = model("User", schema);

export default User;
