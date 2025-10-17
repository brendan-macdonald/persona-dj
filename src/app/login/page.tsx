"use client";

import { signIn } from "next-auth/react";
import { Music } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function LoginPage() {
  return (
    <PageTransition>
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-indigo-200/30 border border-gray-100 p-12 w-full max-w-md text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-3xl mb-8 shadow-lg shadow-indigo-500/20">
            <Music className="w-10 h-10 text-indigo-600" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
            Welcome to Persona DJ
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-10 font-medium">
            Turn a vibe into a playlist
          </p>

          {/* Spotify Login Button */}
          <button
            onClick={() => signIn("spotify", { callbackUrl: "/landing" })}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mb-6"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Continue with Spotify
          </button>

          {/* Demo Mode Link */}
          <button className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-semibold">
            Try Demo Mode
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
