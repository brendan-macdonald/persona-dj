"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * AuthProvider wraps the app to provide authentication context
 * This makes useSession() available in all child components
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
