/**
 * fetchWithRetry - Fetch helper with automatic retry logic
 * Retries on network errors and 500s, not on client errors (400s)
 */

interface RetryOptions {
  maxRetries?: number;
  onRetry?: (attempt: number, maxRetries: number) => void;
}

export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  const maxRetries = retryOptions?.maxRetries || 3;
  const onRetry = retryOptions?.onRetry;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);

      // Success or client error (don't retry 400s)
      if (res.ok || (res.status >= 400 && res.status < 500)) {
        return res;
      }

      // Server error (5xx) - retry
      if (res.status >= 500) {
        throw new Error(`Server error: ${res.status}`);
      }

      return res;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this is the last attempt, throw
      if (attempt === maxRetries - 1) {
        throw lastError;
      }

      // Notify about retry
      if (onRetry) {
        onRetry(attempt + 1, maxRetries);
      }

      // Exponential backoff: 1s, 2s, 4s
      const delayMs = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError || new Error("Request failed");
}

/**
 * Helper to create user-friendly error messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes("Failed to fetch")) {
      return "Network error. Please check your internet connection.";
    }
    if (error.message.includes("429")) {
      return "Too many requests. Please wait a moment and try again.";
    }
    if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      return "Session expired. Please log in again.";
    }
    if (error.message.includes("500")) {
      return "Server error. Please try again in a moment.";
    }
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}
