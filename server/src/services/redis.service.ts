import redisClient from "../config/redis";
import { AppError } from "../middleware/error.middleware";

export class RedisService {
  static async set(
    key: string,
    value: any,
    expireTime?: number
  ): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (expireTime) {
        await redisClient.setex(key, expireTime, stringValue);
      } else {
        await redisClient.set(key, stringValue);
      }
    } catch (error) {
      throw new AppError(500, "Failed to set cache");
    }
  }

  static async get(key: string): Promise<any> {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      throw new AppError(500, "Failed to get cache");
    }
  }

  static async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      throw new AppError(500, "Failed to delete cache");
    }
  }

  static async clearPattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch (error) {
      throw new AppError(500, "Failed to clear cache pattern");
    }
  }
}
