import { z } from "zod";
// Playlist spec schema and helpers
// Used for validating and normalizing playlist requests

// PlaylistSpec describes the requirements for generating a music playlist
// Zod schema for playlist requirements
const PlaylistSpec = z.object({
  genres: z.array(z.string()).min(1).max(5),
  tempoRange: z
    .object({
      min: z.number().min(60).max(220),
      max: z.number().min(60).max(220),
    })
    .refine((obj) => obj.min <= obj.max, {
      message: "min must be less than or equal to max",
    }),
  energy: z.number().min(0).max(1),
  danceability: z.number().min(0).max(1),
  valence: z.number().min(0).max(1).optional(),
  seedArtists: z.array(z.string()).optional(),
  seedTracks: z.array(z.string()),
  notes: z.string().optional(),
});

// Type for validated playlist spec
type PlaylistSpecT = z.infer<typeof PlaylistSpec>;

// Ensures values are within bounds even if the input is out of range
// Clamp and validate playlist spec values
function clampSpec(input: unknown): PlaylistSpecT {
  // Parse and validate input, throwing if invalid
  const parsed = PlaylistSpec.parse(input);

  // Clamp values to bounds
  return {
    ...parsed,
    tempoRange: {
      min: Math.max(60, Math.min(220, parsed.tempoRange.min)),
      max: Math.max(60, Math.min(220, parsed.tempoRange.max)),
    },
    energy: Math.max(0, Math.min(1, parsed.energy)),
    danceability: Math.max(0, Math.min(1, parsed.danceability)),
    valence:
      parsed.valence !== undefined
        ? Math.max(0, Math.min(1, parsed.valence))
        : undefined,
    genres: parsed.genres.slice(0, 5),
    seedArtists: parsed.seedArtists?.slice(0) ?? undefined,
    seedTracks: parsed.seedTracks.slice(0),
    notes: parsed.notes,
  };
}

export { PlaylistSpec, clampSpec };
export type { PlaylistSpecT };
