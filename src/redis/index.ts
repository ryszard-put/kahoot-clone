import { createClient } from "redis";

export const redisClient = createClient();

export const initRedis = async () => {

  redisClient.on('error', (err) => console.log("Redis Client Error", err));

  await redisClient.connect();
}