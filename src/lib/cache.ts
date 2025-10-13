// Simple LRU cache with 1 hour TTL for vibe→spec lookups
// Includes normKey helper for normalizing vibe strings

const CACHE_TTL = 1000 * 60 * 60; // 1 hour in ms
const MAX_SIZE = 100; // Max cache entries

// Internal cache storage
const cache = new Map<string, { value: any; expires: number }>();

/**
 * @function normKey - Normalize a vibe string for cache key
 * Trims, lowercases, and collapses spaces
 * @param v - input string
 * @returns normalized string
 */
function normKey(v: string): string {
  return v.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * @function getCache - Get cached value for key if not expired
 * @param key - cache key
 * @returns cached value or undefined
 */
function getCache(key: string): any {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return undefined;
  }
  // Move accessed entry to end (LRU)
  cache.delete(key);
  cache.set(key, entry);
  return entry.value;
}

/**
 * @function setCache - Store value in cache with TTL, evict LRU if needed
 * @param key - cache key
 * @param value - value to cache
 */
function setCache(key: string, value: any): void {
  if (cache.size >= MAX_SIZE) {
    // Remove least recently used (first entry)
    const firstKey = cache.keys().next().value;
    if (typeof firstKey === "string") {
      cache.delete(firstKey);
    }
  }
  cache.set(key, { value, expires: Date.now() + CACHE_TTL });
}

export { normKey, getCache, setCache };
