// translate API route
// POST {vibe} → returns {spec}
import { normKey, getCache, setCache } from "@/lib/cache"; // LRU cache helper functions
import { vibeToSpec } from "@/lib/llm"; // llm spec generator
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @function POST
 * Handles POST requests to translate vibe to spec.
 *   - Checks cache for normalized vibe key.
 *   - On miss, calls vibeToSpec, stores in cache, and persists to DB.
 *   - Returns spec as JSON, handles errors.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const { vibe } = await req.json();
    if (!vibe || typeof vibe !== "string") {
      return Response.json(
        { error: "Missing or invalid vibe" },
        { status: 400 }
      );
    }

    const key = normKey(vibe);
    let spec = getCache(key);

    if (!spec) {
      spec = await vibeToSpec(vibe);
      setCache(key, spec);
      await prisma.vibe.create({
        data: {
          inputText: vibe,
          normalizedKey: key,
          specJson: spec,
          tracks: [],
        },
      });
    }

    return Response.json({ spec });
  } catch (e) {
    return Response.json(
      { error: "Server error", details: String(e) },
      { status: 500 }
    );
  }
}
