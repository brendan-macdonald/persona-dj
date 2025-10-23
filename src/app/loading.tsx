/**
 * Global Loading UI
 * Displayed during page navigation and Suspense boundaries
 * This is a Next.js App Router convention file
 */

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="text-center">
        {/* Animated Music Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-3xl mb-6 shadow-lg shadow-indigo-500/20 animate-pulse">
          <svg
            className="w-10 h-10 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">Loading...</h2>

        <p className="text-gray-600 text-sm">Getting your vibe ready</p>

        {/* Animated Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div
            className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
