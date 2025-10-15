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
  for (let i = 0; i < 2; i++) {
    const res = await fetch(url, { ...init, headers });
    if (res.status === 429) {
      const retry = parseInt(res.headers.get("Retry-After") || "1", 10);
      console.log(`⏳ Rate limited, retrying in ${retry}s`);
      await new Promise((r) => setTimeout(r, retry * 1000));
      continue;
    }
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`❌ Spotify API Error ${res.status}:`, errorBody);
      console.error(`   URL: ${url}`);
      throw new Error(`Spotify API error: ${res.status}`);
    }
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
 * DEPRECATED: Spotify Recommendations API
 * As of Nov 27, 2024, new apps cannot access /recommendations endpoint
 * See: https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api
 *
 * TODO (Option 2): Replace with search-based recommendation logic
 * Strategy: Use /search endpoint with filters:
 *   - Search by genre
 *   - Filter by artist if specified
 *   - Combine multiple search queries
 *   - Rank/deduplicate results
 */

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

export { sFetch, search, createPlaylist, addTracks };
