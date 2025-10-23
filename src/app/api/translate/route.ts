// translate API route
// POST {vibe} → returns {spec}
import { normKey, getCache, setCache } from "@/lib/cache";
import { vibeToSpec } from "@/lib/llm";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

// Rate limiter: 20 requests per minute per IP
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 unique IPs tracked
});

/**
 * @function POST
 * Handles POST requests to translate vibe to spec.
 *   - Checks rate limit
 *   - Checks cache for normalized vibe key.
 *   - On miss, calls vibeToSpec, stores in cache, and persists to DB.
 *   - Returns spec as JSON, handles errors.
 */
export async function POST(req: Request): Promise<Response> {
  // Rate limiting check
  const ip = getClientIp(req);
  const { success, remaining } = limiter.check(ip, 20); // 20 requests per minute

  if (!success) {
    return rateLimitResponse(remaining, 60);
  }

  try {
    const { vibe } = await req.json();
    if (!vibe || typeof vibe !== "string") {
      return Response.json(
        { error: "Missing or invalid vibe" },
        { status: 400 }
      );
    }

    // Get session for user identification
    const session = await getServerSession(authOptions);
    const spotifyId = session?.user?.spotifyId;

    const key = normKey(vibe);
    let spec = getCache(key);
    let vibeId = null;

    if (!spec) {
      spec = await vibeToSpec(vibe);
      setCache(key, spec);

      // Create or find user first
      let user = null;
      if (spotifyId) {
        // Try to find existing user
        user = await prisma.user.findUnique({
          where: { providerId: spotifyId },
        });

        // Create if doesn't exist
        if (!user) {
          user = await prisma.user.create({
            data: { providerId: spotifyId },
          });
        }
      }

      // Save vibe with userId link
      const vibeRecord = await prisma.vibe.create({
        data: {
          inputText: vibe,
          normalizedKey: key,
          specJson: spec,
          tracks: [],
          userId: user?.id || null,
        },
      });

      vibeId = vibeRecord.id;
    } else {
      // Cache hit - try to find existing vibe ID
      const existingVibe = await prisma.vibe.findFirst({
        where: { normalizedKey: key },
        select: { id: true },
      });
      vibeId = existingVibe?.id || null;
    }

    return Response.json({ spec, vibeId });
  } catch (e) {
    return Response.json(
      { error: "Server error", details: String(e) },
      { status: 500 }
    );
  }
}
