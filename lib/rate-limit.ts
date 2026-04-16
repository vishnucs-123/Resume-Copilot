import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export const rateLimiters = {
  ai: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "1 h"),
        analytics: true,
        prefix: "ratelimit:ai",
      })
    : null,

  uploads: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 h"),
        analytics: true,
        prefix: "ratelimit:uploads",
      })
    : null,

  writes: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, "1 h"),
        analytics: true,
        prefix: "ratelimit:writes",
      })
    : null,
};

export async function checkRateLimit(
  limiter: keyof typeof rateLimiters,
  key: string
) {
  const instance = rateLimiters[limiter];

  if (!instance) {
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  return instance.limit(key);
}