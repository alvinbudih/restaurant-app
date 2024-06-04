import { rule, shield } from "graphql-shield";
import { verify } from "jsonwebtoken";
import redis from "../config/redis";
import userRequest from "../config/user-server";
import { GraphQLError } from "graphql";

interface PayloadToken {
  id: string;
  username: string;
  email: string;
  role: string;
  token: string;
}

type Author = {
  _id: string;
  username: string;
  email: string;
  role: string;
  phoneNumber: string;
  address: string;
};

const secretKey = process.env.JWT_SECRET!;

export default async function isAuthenticated(
  Authorization: string
): Promise<Author> {
  if (!Authorization) {
    throw new GraphQLError("Unauthenticated", {
      extensions: {
        code: "Invalid Token",
        http: { status: 401 },
      },
    });
  }

  const [bearer, token] = Authorization.split(" ");

  if (bearer !== "Bearer") {
    throw new GraphQLError("Invalid Token", {
      extensions: {
        code: "Invalid Token",
        http: { status: 401 },
      },
    });
  }

  const payload = verify(token, secretKey) as PayloadToken;

  let user: Author | string | null = await redis.get(`user:${payload.id}`);

  if (!user) {
    const { data } = await userRequest<Author>({
      method: "GET",
      url: `/users/${payload.id}`,
      headers: {
        Authorization,
      },
    });

    user = data;
  } else {
    user = JSON.parse(user) as Author;
  }

  return user;
}
