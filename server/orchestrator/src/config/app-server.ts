import axios from "axios";

const appUrl = process.env.APP_URL!;

const appRequest = axios.create({
  baseURL: appUrl,
});

export default appRequest;
