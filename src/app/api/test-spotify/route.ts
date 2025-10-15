// Test endpoint to check Spotify API access
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const results: Record<string, any> = {};

  // Test 1: Get current user profile
  try {
    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    results.me = {
      status: userRes.status,
      ok: userRes.ok,
      data: userRes.ok ? await userRes.json() : await userRes.text(),
    };
  } catch (e) {
    results.me = { error: String(e) };
  }

  // Test 2: Get user's top tracks
  try {
    const topRes = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?limit=5",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    results.topTracks = {
      status: topRes.status,
      ok: topRes.ok,
      data: topRes.ok ? await topRes.json() : await topRes.text(),
    };
  } catch (e) {
    results.topTracks = { error: String(e) };
  }

  // Test 3: Search for an artist
  try {
    const searchRes = await fetch(
      "https://api.spotify.com/v1/search?q=Beatles&type=artist&limit=1",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    results.search = {
      status: searchRes.status,
      ok: searchRes.ok,
      data: searchRes.ok ? await searchRes.json() : await searchRes.text(),
    };
  } catch (e) {
    results.search = { error: String(e) };
  }

  // Test 4: Get recommendations (the problematic endpoint)
  try {
    const recRes = await fetch(
      "https://api.spotify.com/v1/recommendations?seed_genres=pop,rock&limit=5",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    results.recommendations = {
      status: recRes.status,
      ok: recRes.ok,
      data: recRes.ok ? await recRes.json() : await recRes.text(),
    };
  } catch (e) {
    results.recommendations = { error: String(e) };
  }

  // Test 5: Get available genre seeds
  try {
    const genreRes = await fetch(
      "https://api.spotify.com/v1/recommendations/available-genre-seeds",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    results.availableGenreSeeds = {
      status: genreRes.status,
      ok: genreRes.ok,
      data: genreRes.ok ? await genreRes.json() : await genreRes.text(),
    };
  } catch (e) {
    results.availableGenreSeeds = { error: String(e) };
  }

  // Test 6: Get audio features (check if deprecated endpoint still works)
  try {
    // Using a known track ID: "11dFghVXANMlKmJXsNCbNl" (example from docs)
    const audioFeaturesRes = await fetch(
      "https://api.spotify.com/v1/audio-features/11dFghVXANMlKmJXsNCbNl",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    results.audioFeatures = {
      status: audioFeaturesRes.status,
      ok: audioFeaturesRes.ok,
      data: audioFeaturesRes.ok
        ? await audioFeaturesRes.json()
        : await audioFeaturesRes.text(),
    };
  } catch (e) {
    results.audioFeatures = { error: String(e) };
  }

  // Test 7: Get audio features for multiple tracks (batch)
  try {
    const batchRes = await fetch(
      "https://api.spotify.com/v1/audio-features?ids=11dFghVXANMlKmJXsNCbNl,7ouMYWpwJ422jRcDASZB7P",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    results.audioFeaturesBatch = {
      status: batchRes.status,
      ok: batchRes.ok,
      data: batchRes.ok ? await batchRes.json() : await batchRes.text(),
    };
  } catch (e) {
    results.audioFeaturesBatch = { error: String(e) };
  }

  return Response.json({
    message: "Spotify API Access Test Results",
    tokenPresent: !!token,
    tokenLength: token?.length,
    results,
  });
}
