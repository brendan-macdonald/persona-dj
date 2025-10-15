// Search-based music discovery using Spotify Search API
import { search } from "./spotify";
import { PlaylistSpecT } from "./specs";
import { SearchStrategy } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Normalize genre for Spotify search API
 * Converts spaces to hyphens, & to -n-, etc.
 */
function normalizeGenre(genre: string): string {
  return genre
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-n-")
    .replace(/\//g, "-");
}

/**
 * @function buildSearchQueries - Build search query strings from LLM strategy and spec
 * Returns array of search queries to execute
 */

function buildSearchQueries(
  strategy: SearchStrategy,
  spec: PlaylistSpecT
): string[] {
  const queries: string[] = [];

  // #1 Primary queries -> LLM-generated genres + keywords + year
  for (const genre of strategy.genrePriority.slice(0, 3)) {
    const parts: string[] = [];

    //add genre filter
    parts.push(`genre:${normalizeGenre(genre)}`);

    //add top 2 search keywords
    if (strategy.searchKeywords.length > 0) {
      parts.push(strategy.searchKeywords.slice(0, 2).join(" "));
    }

    //add year range if provided
    if (strategy.yearRange) {
      parts.push(`year:${strategy.yearRange}`);
    }

    queries.push(parts.join(" "));
  }

  //#2 Secondary queries -> artist + genre combos if artist are available
  if (spec.seedArtists && spec.seedArtists.length > 0) {
    for (const artist of spec.seedArtists.slice(0, 2)) {
      for (const genre of spec.genres.slice(0, 2)) {
        queries.push(`artist:"${artist}" genre:${normalizeGenre(genre)}`);
      }
    }
  }

  //#3 last query level -> Keywords only for discovery (if we have enough keywords (3 at the moment))
  if (strategy.searchKeywords.length >= 3) {
    queries.push(strategy.searchKeywords.slice(0, 3).join(" "));
  }

  // Fallback - If no queries generated, we use original genres
  if (queries.length === 0) {
    for (const genre of spec.genres) {
      queries.push(`genre:${normalizeGenre(genre)}`);
    }
  }

  return queries;
}

/**
 * Deduplicate tracks by ID
 */
function deduplicateById(tracks: any[]): any[] {
  const seen = new Set<string>();
  const unique: any[] = [];

  for (const track of tracks) {
    if (!seen.has(track.id)) {
      seen.add(track.id);
      unique.push(track);
    }
  }

  return unique;
}

/**
 * @function discoverTracks Main discovery function
 * Execute searches, combine, filter, and rank
 */

async function discoverTracks(
  queries: string[],
  spec: PlaylistSpecT,
  token: string
): Promise<any[]> {
  const allTracks: any[] = [];

  //EXECUTE ALL SEARCH QUERIES
  for (const q of queries) {
    try {
      const results = await search(token, q, "track", 20);
      if (results.tracks?.items) {
        allTracks.push(...results.tracks.items);
      }
    } catch (error) {
      console.error(`Search failed for "${q}":`, error);
      // Continue with other queries even if one fails
    }
  }

  // Deduplicate by track ID
  const uniqueTracks = deduplicateById(allTracks);

  const filtered = uniqueTracks;

  // Rank by popularity (higher = better)
  const ranked = filtered.sort(
    (a, b) => (b.popularity || 0) - (a.popularity || 0)
  );

  // Return top 50
  const top50 = ranked.slice(0, 50);

  return top50;
}

export { normalizeGenre, buildSearchQueries, discoverTracks };
