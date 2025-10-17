"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import PlaylistHistory from "./PlaylistHistory";

/**
 * LoginButton - Shows login/logout button based on session state
 * Uses NextAuth's useSession to check if user is logged in
 */
export default function LoginButton() {
  const { data: session, status } = useSession();
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state while checking session
  if (status === "loading") {
    return <div className="text-gray-600 text-sm">Loading...</div>;
  }

  // Modal component
  const modal =
    showHistory && mounted
      ? createPortal(
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[999999] flex items-center justify-center p-4"
            onClick={() => setShowHistory(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  My Playlists
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <PlaylistHistory />
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  // If logged in, show user info and logout button
  if (session?.user) {
    return (
      <>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHistory(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            My Playlists
          </button>
          <span className="text-sm text-gray-700 font-semibold">
            {session.user.name || session.user.email}
          </span>
          <button
            onClick={() => signOut()}
            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md"
          >
            Sign Out
          </button>
        </div>
        {modal}
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
