import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import ConditionalNav from "../components/ConditionalNav";

// Font setup (Next.js font optimization)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for <head>
export const metadata: Metadata = {
  title: "Persona DJ",
  description: "AI-powered DJ persona app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is the main layout component for all pages
  return (
    <html lang="en">
      <head>{/* Next.js will inject metadata here */}</head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <AuthProvider>
          {/* Conditional top navigation bar */}
          <ConditionalNav />
          {/* Main content */}
          <main>{children}</main>
          {/* Toasts placeholder */}
          <div id="toast-root" />
        </AuthProvider>
      </body>
    </html>
  );
}
