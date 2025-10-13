// recommend API route
// POST {spec} => returns {tracks}
import { PlaylistSpec, PlaylistSpecT } from "@/lib/specs"; //zod schema and the type
import { buildSeeds, recParams } from "@/lib/recs"; //spotify seed and params helpers
import { recommendations } from "@/lib/spotify"; //Spotify API call
import { getServerSession } from "next-auth"; //next auth session
import { authOptions } from "../auth/[...nextauth]/route"; //next auth config

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @function POST
 * Handles POST requests to recommend tracks from spec.
 *   - Validates spec with Zod.
 *   - Requires session with Spotify accessToken.
 *   - Resolves seeds, builds params, calls Spotify recommendations.
 *   - Maps results to {id, uri, name, artists, preview_url}.
 *   - Returns tracks as JSON, handles errors.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    // parse and validate spec
    const { spec } = await req.json();
    const parsed: PlaylistSpecT = PlaylistSpec.parse(spec);

    // get session and check for accessToken
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // resolve seeds and build params
    const seeds = await buildSeeds(token, parsed);
    const params = recParams(parsed, seeds);

    // call Spotify recommendations API
    const recs = await recommendations(token, params);

    const tracks = (recs.tracks || []).map((t: any) => ({
      id: t.id,
      uri: t.uri,
      name: t.name,
      artists: t.artists.map((a: any) => a.name).join(", "),
      preview_url: t.preview_url,
    }));

    return Response.json({ tracks });
  } catch (e: any) {
    // Zod validation error
    if (e.name === "ZodError") {
      return Response.json(
        { error: "Invalid spec", details: e.errors },
        { status: 400 }
      );
    }
    // Other errors
    return Response.json(
      { error: "Server error", details: String(e) },
      { status: 500 }
    );
  }
}
