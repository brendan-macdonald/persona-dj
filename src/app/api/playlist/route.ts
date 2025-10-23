// playlist API route
// POST {name, description, uris[]} => creates playlist and adds tracks
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sFetch, createPlaylist, addTracks } from "@/lib/spotify";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

// Rate limiter: 10 playlists per minute per IP (stricter since this writes to Spotify)
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @function POST
 * Handles POST requests to create a playlist and add tracks.
 *   - checks rate limit
 *   - requires session with Spotify accessToken.
 *   - calls /me to get user id.
 *   - creates playlist with name/description.
 *   - adds tracks by uris.
 *   - returns {playlistId, url} as JSON.
 *   - handles errors cleanly.
 */
export async function POST(req: Request): Promise<Response> {
  // Rate limiting check
  const ip = getClientIp(req);
  const { success, remaining } = limiter.check(ip, 10); // 10 playlists per minute

  if (!success) {
    return rateLimitResponse(remaining, 60);
  }

  try {
    // parse request body
    const { name, description, uris, vibeId } = await req.json();
    if (!name || !Array.isArray(uris) || uris.length === 0) {
      return Response.json(
        { error: "Missing name or uris[]" },
        { status: 400 }
      );
    }

    // get session and check for accessToken
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    const spotifyId = session?.user?.spotifyId;

    if (!token || !spotifyId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // get user id from /me
    const me = await sFetch(token, "/me");
    const spotifyUserId = me.id;
    if (!spotifyUserId) {
      return Response.json({ error: "Could not get user id" }, { status: 500 });
    }

    // Find or create our User record
    const user = await prisma.user.upsert({
      where: { providerId: spotifyId },
      update: {},
      create: { providerId: spotifyId },
    });

    // create playlist on Spotify
    const playlist = await createPlaylist(
      token,
      spotifyUserId,
      name,
      description
    );
    const playlistId = playlist.id;
    const url = playlist.external_urls?.spotify;

    if (!playlistId) {
      return Response.json(
        { error: "Could not create playlist" },
        { status: 500 }
      );
    }

    // add tracks to Spotify playlist
    await addTracks(token, playlistId, uris);

    // Save playlist to our database for history tracking
    await prisma.playlist.create({
      data: {
        userId: user.id,
        vibeId: vibeId || null,
        spotifyId: playlistId,
        spotifyUrl: url,
        name: name,
        trackCount: uris.length,
      },
    });

    console.log(
      `[Playlist] Created and saved: ${name} (${uris.length} tracks)`
    );

    return Response.json({ playlistId, url });
  } catch (e: any) {
    console.error("[Playlist] Error:", e);
    return Response.json(
      { error: "Server error", details: String(e) },
      { status: 500 }
    );
  }
}
