import Link from "next/link";

/**
 * Custom 404 Not Found Page
 * Displayed when a user navigates to a route that doesn't exist
 * This is a Next.js App Router convention file
 */

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-indigo-200/30 border border-gray-100 p-12 w-full max-w-md text-center">
        {/* 404 Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-3xl mb-8 shadow-lg shadow-indigo-500/20">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-extrabold text-gray-900 mb-3 leading-tight">
          404
        </h1>

        <h2 className="text-2xl font-bold text-gray-700 mb-3">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist. It might have
          been moved or deleted.
        </p>

        {/* Action Button */}
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-xl text-base font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
