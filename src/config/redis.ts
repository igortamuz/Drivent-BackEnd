import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL,
});
export async function connectRedis(): Promise<void> {
  await redis.connect();
}

export async function disconnectRedis(): Promise<void> {
  await redis?.disconnect();
}
