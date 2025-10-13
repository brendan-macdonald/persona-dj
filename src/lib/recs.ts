// Helpers for resolving Spotify seeds and building recommendation parameters
import { search } from "./spotify";
import { PlaylistSpecT } from "./specs";

/**
 * buildSeeds - Resolves up to 2 artist IDs and 1 track ID from names or IDs
 * @param token - Spotify access token
 * @param spec - Playlist spec
 * @returns { seed_artists: string[], seed_tracks: string[] }
 */

async function buildSeeds(token: string, spec: PlaylistSpecT) {
  const seed_artists: string[] = [];
  const seed_tracks: string[] = [];

  //Helper function to check if string is a spotify id (22 characters and alphanumeric)
  const isId = (str: string) => /^[a-zA-Z0-9]{22}$/.test(str);

  //resolve artists
  for (const artist of spec.seedArtists?.slice(0, 2) || []) {
    if (isId(artist)) {
      seed_artists.push(artist);
    } else {
      const res = await search(token, artist, "artist", 1);
      const id = res.artists?.items?.[0]?.id;
      if (id) seed_artists.push(id);
    }
  }

  //resolve track
  for (const track of spec.seedTracks?.slice(0, 1) || []) {
    if (isId(track)) {
      seed_tracks.push(track);
    } else {
      const res = await search(token, track, "track", 1);
      const id = res.tracks?.items?.[0]?.id;
      if (id) seed_tracks.push(id);
    }
  }

  return { seed_artists, seed_tracks };
}

/**
 * recParams - Build Spotify recommendations query params from spec and seeds
 * @param spec - Playlist spec
 * @param seeds - Seed artist and track IDs
 * @param count - Number of recommendations (default 50)
 * @returns Query params object for Spotify recommendations
 */

function recParams(
  spec: PlaylistSpecT,
  seeds: { seed_artists: string[]; seed_tracks: string[] },
  count = 50
) {
  // window for energy / danceability
  const win = (val: number) => [
    Math.max(0, val - 0.15),
    Math.min(1, val + 0.15),
  ];

  const params: Record<string, string | number> = {
    seed_artists: seeds.seed_artists.join(","),
    seed_tracks: seeds.seed_tracks.join(","),
    limit: count,
    min_tempo: spec.tempoRange.min,
    max_tempo: spec.tempoRange.max,
    target_energy: spec.energy,
    min_energy: win(spec.energy)[0],
    max_energy: win(spec.energy)[1],
    target_danceability: spec.danceability,
    min_danceability: win(spec.danceability)[0],
    max_danceability: win(spec.danceability)[1],
  };

  if (spec.valence !== undefined) {
    params.target_valence = spec.valence;
    params.min_valence = win(spec.valence)[0];
    params.max_valence = win(spec.valence)[1];
  }

  return params;
}

export { buildSeeds, recParams };
