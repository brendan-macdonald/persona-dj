import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-950 text-white min-h-screen antialiased`}
      >
        {/* Top navigation bar */}
        <nav className="w-full py-4 px-6 bg-gray-900 border-b border-gray-800">
          <div className="max-w-4xl mx-auto flex items-center">
            <span className="text-xl font-bold tracking-tight">Persona DJ</span>
          </div>
        </nav>
        {/* Centered main container */}
        <main className="flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
        {/* Toasts placeholder */}
        <div id="toast-root" />
      </body>
    </html>
  );
}
