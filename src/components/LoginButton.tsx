"use client";

import { signIn, signOut, useSession } from "next-auth/react";

/**
 * LoginButton - Shows login/logout button based on session state
 * Uses NextAuth's useSession to check if user is logged in
 */
export default function LoginButton() {
  const { data: session, status } = useSession();

  // Show loading state while checking session
  if (status === "loading") {
    return <div className="text-gray-400 text-sm">Loading...</div>;
  }

  // If logged in, show user info and logout button
  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">
          {session.user.name || session.user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors border border-gray-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // If not logged in, show login button
  return (
    <button
      onClick={() => signIn("spotify")}
      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
    >
      Sign in with Spotify
    </button>
  );
}
