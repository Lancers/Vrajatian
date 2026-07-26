import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * In-process TTL cache. Right-sized for a single backend instance — no
 * external service to run/pay for. If this app ever needs multiple backend
 * instances behind a load balancer, swap this for a Redis-backed
 * implementation with the same get/set/delByPrefix shape; callers don't change.
 */
@Injectable()
export class CacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  /** Delete every key starting with `prefix` — used for coarse cache invalidation. */
  delByPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }
}
