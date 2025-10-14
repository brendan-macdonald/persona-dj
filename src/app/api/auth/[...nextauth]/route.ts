/* eslint-disable @typescript-eslint/no-explicit-any */
// NextAuth API route for Spotify authentication
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

/**
 *@const authOptions - NextAuth configuration for Spotify provider
 * Requests scopes for email and playlist modification
 * Stores accessToken, refreshToken, expiresAt in JWT
 * Exposes accessToken and expiresAt in session
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
     *@function jwt - Store tokens in JWT on sign-in
     *@param {object} params - Contains session and token info.
     *@returns {token} object for JWT with accessToken, refreshToken, expiresAt
     */
    async jwt({ token, account }: { token: any; account?: any }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    /**
     *@function session - Expose tokens in session object
     *@returns {session} - with accessToken and expiresAt info
     */
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      session.expiresAt = token.expiresAt;
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
