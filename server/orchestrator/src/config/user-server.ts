import axios from "axios";

const userUrl = process.env.USER_URL!;

const userRequest = axios.create({
  baseURL: userUrl,
});

export default userRequest;
