import { LRUCache } from "lru-cache";

/**
 * Rate Limiting Utilities
 *
 * Prevents API abuse by limiting requests per IP address
 * Uses LRU cache for efficient memory management
 */

type RateLimitOptions = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

/**
 * Creates a rate limiter instance
 *
 * @param options.uniqueTokenPerInterval - Maximum number of unique IPs to track (default: 500)
 * @param options.interval - Time window in milliseconds (default: 60000 = 1 minute)
 */
export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute default
  });

  return {
    /**
     * Check if a request should be rate limited
     *
     * @param identifier - Unique identifier (usually IP address)
     * @param limit - Maximum requests allowed per interval (default: 10)
     * @returns Object with success status and remaining requests
     */
    check: (identifier: string, limit: number = 10) => {
      const tokenCount = (tokenCache.get(identifier) as number[]) || [0];

      if (tokenCount[0] === 0) {
        tokenCache.set(identifier, [1]);
        return { success: true, remaining: limit - 1 };
      }

      tokenCount[0] += 1;

      const currentCount = tokenCount[0];
      const isAllowed = currentCount <= limit;

      tokenCache.set(identifier, tokenCount);

      return {
        success: isAllowed,
        remaining: Math.max(0, limit - currentCount),
      };
    },
  };
}

/**
 * Get the client's IP address from the request
 * Works with Vercel's x-forwarded-for header
 *
 * @param request - The Next.js Request object
 * @returns IP address or 'unknown' if not found
 */
export function getClientIp(request: Request): string {
  // Vercel provides the real IP in x-forwarded-for
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list, get the first IP
    return forwardedFor.split(",")[0].trim();
  }

  // Fallback to x-real-ip
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Last resort
  return "unknown";
}

/**
 * Helper to create a rate-limited error response
 *
 * @param remaining - Number of requests remaining (optional)
 * @param retryAfter - Seconds until rate limit resets (optional)
 */
export function rateLimitResponse(remaining?: number, retryAfter?: number) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (remaining !== undefined) {
    headers["X-RateLimit-Remaining"] = remaining.toString();
  }

  if (retryAfter) {
    headers["Retry-After"] = retryAfter.toString();
  }

  return new Response(
    JSON.stringify({
      error: "Too many requests",
      message: "You have exceeded the rate limit. Please try again later.",
    }),
    {
      status: 429,
      headers,
    }
  );
}
