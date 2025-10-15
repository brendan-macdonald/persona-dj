"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import PlaylistHistory from "./PlaylistHistory";

/**
 * LoginButton - Shows login/logout button based on session state
 * Uses NextAuth's useSession to check if user is logged in
 */
export default function LoginButton() {
  const { data: session, status } = useSession();
  const [showHistory, setShowHistory] = useState(false);

  // Show loading state while checking session
  if (status === "loading") {
    return <div className="text-gray-400 text-sm">Loading...</div>;
  }

  // If logged in, show user info and logout button
  if (session?.user) {
    return (
      <>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            My Playlists
          </button>
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

        {/* Playlist History Modal */}
        {showHistory && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowHistory(false)}
          >
            <div
              className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">My Playlists</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                <PlaylistHistory />
              </div>
            </div>
          </div>
        )}
      </>
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
