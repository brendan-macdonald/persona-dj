// discover API route - Search-based music discovery (migrated from deprecated /recommendations)
// POST {spec, vibe} => returns {tracks}
import { PlaylistSpec } from "@/lib/specs";
import { buildSearchQueries, discoverTracks } from "@/lib/discovery";
import { vibeToSearchStrategy } from "@/lib/llm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @function POST /api/discover
 *
 * Implemented a Search-based discovery flow:
 *   1. validates spec with Zod
 *   2. requires session with Spotify accessToken
 *   3. uses LLM to translate vibe → search strategy
 *   4. builds multiple search queries (genre+keywords, artist+genre, etc.)
 *   5. executes searches in parallel
 *   6. deduplicates, filters, and ranks results
 *   7. returns top 50 tracks
 */

export async function POST(req: Request): Promise<Response> {
  try {
    // parse and validate request body
    const { spec, vibe } = await req.json();

    if (!vibe) {
      return Response.json(
        { error: "Missing vibe description" },
        { status: 400 }
      );
    }

    // validate the spec format
    const validatedSpec = PlaylistSpec.parse(spec);

    // get user's Spotify access token from session
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return Response.json(
        { error: "Unauthorized - please log in with Spotify" },
        { status: 401 }
      );
    }

    // 1 - ese LLM to create search strategy from vibe
    const searchStrategy = await vibeToSearchStrategy(vibe, validatedSpec);

    //2 - build search queries from strategy + spec
    const queries = buildSearchQueries(searchStrategy, validatedSpec);

    //3 - execute discovery...search -> dedupe -> filter -> rank
    const discoveredTracks = await discoverTracks(
      queries,
      validatedSpec,
      token
    );

    // 4 - map to frontend formatting
    const tracks = discoveredTracks.map((t: any) => ({
      id: t.id,
      uri: t.uri,
      name: t.name,
      artists: t.artists.map((a: any) => a.name).join(", "),
      preview_url: t.preview_url,
      popularity: t.popularity,
    }));

    return Response.json({
      tracks,
      meta: {
        strategy: searchStrategy,
        queriesExecuted: queries.length,
        totalDiscovered: discoveredTracks.length,
      },
    });
  } catch (e: any) {
    if (e.name === "ZodError") {
      return Response.json(
        { error: "Invalid spec", details: e.errors },
        { status: 400 }
      );
    }
    return Response.json(
      { error: "Server error", details: e.message || String(e) },
      { status: 500 }
    );
  }
}
