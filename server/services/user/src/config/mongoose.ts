import { connect } from "mongoose";

const uri =
  "mongodb+srv://evandraavin21:0AOI9cfKf2676jdV@cluster0.p0pwbkh.mongodb.net/restaurant?retryWrites=true&w=majority&appName=Cluster0/";

connect(uri, {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
});
