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

// Metadata for <head> - Enhanced for SEO and social sharing
export const metadata: Metadata = {
  title: {
    default: "Persona DJ - AI-Powered Playlist Generator",
    template: "%s | Persona DJ",
  },
  description:
    "Transform your vibe into music. Describe your mood and let AI create the perfect Spotify playlist. Powered by OpenAI and Spotify.",
  keywords: [
    "AI playlist",
    "Spotify",
    "music generator",
    "playlist creator",
    "AI music",
    "mood playlist",
    "vibe to music",
    "personalized playlists",
    "OpenAI music",
  ],
  authors: [{ name: "Brendan MacDonald" }],
  creator: "Brendan MacDonald",
  publisher: "Persona DJ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    title: "Persona DJ - AI-Powered Playlist Generator",
    description:
      "Transform your vibe into music. Describe your mood and let AI create the perfect Spotify playlist.",
    url: "https://persona-dj.vercel.app",
    siteName: "Persona DJ",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://persona-dj.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Persona DJ - AI-Powered Playlist Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Persona DJ - AI-Powered Playlist Generator",
    description:
      "Transform your vibe into music. Describe your mood and let AI create the perfect Spotify playlist.",
    images: ["https://persona-dj.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
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
