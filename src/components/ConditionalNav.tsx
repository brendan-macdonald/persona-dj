"use client";

import { usePathname } from "next/navigation";
import LoginButton from "./LoginButton";
import Link from "next/link";
import { Music } from "lucide-react";

export default function ConditionalNav() {
  const pathname = usePathname();

  // Hide nav on login page
  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className="w-full py-5 px-6 bg-white backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/landing"
          className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-gray-900 hover:text-indigo-600 transition-all duration-200 transform hover:scale-105"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center shadow-sm">
            <Music className="w-6 h-6 text-indigo-600" />
          </div>
          Persona DJ
        </Link>
        <LoginButton />
      </div>
    </nav>
  );
}
