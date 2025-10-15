// playlists API route (plural - for fetching list)
// GET => returns user's playlists
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(): Promise<Response> {
  try {
    //get session
    const session = await getServerSession(authOptions);
    const spotifyId = session?.user?.spotifyId;

    if (!spotifyId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // find user
    const user = await prisma.user.findUnique({
      where: { providerId: spotifyId },
      include: {
        playlists: {
          include: {
            vibe: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return Response.json({ playlists: [] });
    }

    //format response
    const playlists = user.playlists.map((p) => ({
      id: p.id,
      name: p.name,
      spotifyUrl: p.spotifyUrl,
      trackCount: p.trackCount,
      createdAt: p.createdAt,
      vibe: p.vibe
        ? {
            inputText: p.vibe.inputText,
          }
        : null,
    }));

    return Response.json({ playlists });
  } catch (e) {
    console.error("[Playlists] Error fetching:", e);
    return Response.json(
      { error: "Server error", details: String(e) },
      { status: 500 }
    );
  }
}
