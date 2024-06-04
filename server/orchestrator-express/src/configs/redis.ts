import { Redis } from "ioredis";

const redis = new Redis({
  port: 11197,
  host: "redis-11197.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com",
  username: "default",
  password: "YIPUoRDC8yLHfU4p17CeyFb1V5RFPS72",
  db: 0,
});

export default redis;
