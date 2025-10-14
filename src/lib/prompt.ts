// System prompt for playlist generator model
const SYSTEM = `
You are a playlist generator. 
Reply ONLY with strict JSON matching this schema, no prose or extra text.

{
  "genres": string[1-5],
  "tempoRange": { "min": 60-200, "max": 60-200, min <= max },
  "energy": number (0..1),
  "danceability": number (0..1),
  "valence": number (0..1),
  "seedArtists": string[] (optional, 1-2 well-known artists if relevant),
  "seedTracks": string[] (optional, 1-2 specific songs if relevant),
  "notes": string (optional, brief description)
}

REQUIRED fields: genres, tempoRange, energy, danceability, valence
OPTIONAL fields: seedArtists, seedTracks, notes
`;

// Build user prompt for playlist generation
function userPrompt(vibe: string, hints?: Record<string, unknown>) {
  // Compose constraints
  const constraints = [
    "Tempo min/max must be between 60 and 200 BPM.",
    "Include 1–5 genres.",
    "All audio features (energy, danceability, valence) are required.",
    "If you can suggest specific well-known artists or tracks that match the vibe, include them.",
    "Reply only with JSON, no extra prose.",
  ];

  // Add hints if provided
  const hintsText = hints ? `Hints: ${JSON.stringify(hints)}` : "";

  // Build the prompt
  return [`Vibe: ${vibe}`, ...constraints, hintsText]
    .filter(Boolean)
    .join("\n");
}

export { SYSTEM, userPrompt };
