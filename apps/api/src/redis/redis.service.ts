import { Injectable }
from "@nestjs/common";

import Redis
from "ioredis";

@Injectable()
export class RedisService {

  private redis: Redis;

  constructor() {

   this.redis = new Redis({

  host:
    process.env.REDIS_HOST ||
    "localhost",

  port:
    Number(
      process.env.REDIS_PORT
    ) || 6379,
});
  }

  // GET
  async get(
    key: string
  ) {

    return this.redis.get(key);
  }

  // SET
  async set(
    key: string,
    value: string
  ) {

    return this.redis.set(
      key,
      value,
      "EX",
      3600
    );
  }
  async del(
  key: string
) {

  return this.redis.del(
    key
  );
}
}