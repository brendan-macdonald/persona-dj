// playlist API route
// POST {name, description, uris[]} => creates playlist and adds tracks
import { getServerSession } from "next-auth"; // next auth session
import { authOptions } from "../auth/[...nextauth]/route"; // next auth config
import { sFetch, createPlaylist, addTracks } from "@/lib/spotify"; // Spotify helpers

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @function POST
 * Handles POST requests to create a playlist and add tracks.
 *   - requires session with Spotify accessToken.
 *   - calls /me to get user id.
 *   - creates playlist with name/description.
 *   - adds tracks by uris.
 *   - returns {playlistId, url} as JSON.
 *   - handles errors cleanly.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    // parse request body
    const { name, description, uris } = await req.json();
    if (!name || !Array.isArray(uris) || uris.length === 0) {
      return Response.json(
        { error: "Missing name or uris[]" },
        { status: 400 }
      );
    }

    // get session and check for accessToken
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // get user id from /me
    const me = await sFetch(token, "me");
    const userId = me.id;
    if (!userId) {
      return Response.json({ error: "Could not get user id" }, { status: 500 });
    }

    // create playlist
    const playlist = await createPlaylist(token, userId, name, description);
    const playlistId = playlist.id;
    const url = playlist.external_urls?.spotify;
    if (!playlistId) {
      return Response.json(
        { error: "Could not create playlist" },
        { status: 500 }
      );
    }

    // add tracks
    await addTracks(token, playlistId, uris);

    return Response.json({ playlistId, url });
  } catch (e: any) {
    return Response.json(
      { error: "Server error", details: String(e) },
      { status: 500 }
    );
  }
}
