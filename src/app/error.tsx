"use client";

import Link from "next/link";

/**
 * Global Error Boundary
 * Catches unhandled errors in the application and displays a user-friendly error page
 * This is a Next.js App Router convention file
 */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-indigo-200/30 border border-gray-100 p-12 w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-3xl mb-8 shadow-lg shadow-red-500/20">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          We encountered an unexpected error. Don&apos;t worry, your data is
          safe. Try refreshing the page or going back home.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <details className="text-left mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
              Error Details (dev only)
            </summary>
            <pre className="text-xs text-red-600 overflow-auto max-h-40">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-xl text-base font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="w-full px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-base font-semibold transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md block text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
