/* eslint-disable @typescript-eslint/no-explicit-any */
// NextAuth API route for Spotify authentication
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

/**
 * Refresh the Spotify access token using refresh token
 */
async function refreshAccessToken(token: any) {
  try {
    const url = "https://accounts.spotify.com/api/token";
    const basicAuth = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    console.log("✅ [NextAuth] Token refreshed successfully");

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("❌ [NextAuth] Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

/**
 *@const authOptions - NextAuth configuration for Spotify provider
 * Requests scopes for email and playlist modification
 * Stores accessToken, refreshToken, expiresAt in JWT
 * Exposes accessToken and expiresAt in session
 * Automatically refreshes tokens when expired
 */
export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "user-read-email playlist-modify-private playlist-modify-public user-top-read",
        },
      },
    }),
  ],
  callbacks: {
    /**
     *@function jwt - Store tokens in JWT on sign-in and refresh when expired
     *@param {object} params - Contains session and token info.
     *@returns {token} object for JWT with accessToken, refreshToken, expiresAt
     */
    async jwt({ token, account }: { token: any; account?: any }) {
      // Initial sign in
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at * 1000; // Convert to milliseconds
        return token;
      }

      // Return previous token if not expired
      if (Date.now() < token.expiresAt) {
        return token;
      }

      // Token has expired, refresh it
      console.log("⏰ [NextAuth] Token expired, refreshing...");
      return refreshAccessToken(token);
    },
    /**
     *@function session - Expose tokens in session object
     *@returns {session} - with accessToken and expiresAt info
     */
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      session.expiresAt = token.expiresAt;
      session.user = {
        email: token.email,
        name: token.name,
        spotifyId: token.sub,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: false,
};

//NextAuth GET handler for API route
export const GET = NextAuth(authOptions);

//NextAuth POST handler for API route
export const POST = NextAuth(authOptions);
