const BASE_URL = "https://api.spotify.com/v1";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * sFetch - Spotify API fetch helper with 429 retry-after handling
 * Handles rate limits by waiting and retrying once
 * @param token - Spotify access token
 * @param path - API path (e.g., "/search")
 * @param init - Optional fetch init object
 */
async function sFetch(
  token: string,
  path: string,
  init?: RequestInit
): Promise<any> {
  const url = BASE_URL + path;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, { ...init, headers });
    if (res.status === 429) {
      const retryAfter = parseInt(res.headers.get("Retry-After") || "1", 10);
      await new Promise((r) => setTimeout(r, retryAfter * 1000));
      continue;
    }
    if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
    return await res.json();
  }
  throw new Error("Spotify API rate limit exceeded");
}

/**
 * search - Search Spotify for artists or tracks
 * @param token - Spotify access token
 * @param q - Query string
 * @param type - "artist" or "track"
 * @param limit - Max results (default 5)
 * Uses @function sFetch for API call
 * encodes query string
 */

async function search(
  token: string,
  q: string,
  type: "artist" | "track",
  limit = 5
) {
  return sFetch(
    token,
    `/search?q=${encodeURIComponent(q)}&type=${type}&limit=${limit}`
  );
}

/**
 * recommendations - Get track recommendations
 * @param token - Spotify access token
 * @param params - Query params object
 * @constant qs - converts params to query string
 * Uses @function sFetch for the API call
 */

async function recommendations(token: string, params: Record<string, any>) {
  const qs = new URLSearchParams(params).toString();
  return sFetch(token, `/recommendations?${qs}`);
}

/**
 * createPlaylist - Create a new playlist for a user
 * @param token - Spotify access token
 * @param userId - Spotify user ID
 * @param name - Playlist name
 * @param description - Playlist description
 * Uses @function sFetch for the API call
 * Sends post request with JSON body
 */
async function createPlaylist(
  token: string,
  userId: string,
  name: string,
  description: string
) {
  return sFetch(token, `/users/${userId}/playlists`, {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

/**
 * addTracks - Add tracks to a playlist
 * @param token - Spotify access token
 * @param playlistId - Playlist ID
 * @param uris - Array of track URIs
 * Uses @function sFetch for the API call
 * Sends post request with JSON body
 */

async function addTracks(token: string, playlistId: string, uris: string[]) {
  return sFetch(token, `/playlists/${playlistId}/tracks`, {
    method: "POST",
    body: JSON.stringify({ uris }),
  });
}

export { sFetch, search, recommendations, createPlaylist, addTracks };
