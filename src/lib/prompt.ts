// System prompt for playlist generator model
const SYSTEM = `
You are a playlist generator. 
Reply ONLY with strict JSON matching this schema, no prose or extra text.

{
  "genres": string[1-5],
  "tempoRange": { "min": 60-220, "max": 60-220, min <= max },
  "energy": number (0..1),
  "danceability": number (0..1),
  "valence": number (0..1, optional),
  "seedArtists": string[] (optional, ~2 if possible),
  "seedTracks": string[] (at least 1 if possible),
  "notes": string (optional)
}
`;

// Build user prompt for playlist generation
function userPrompt(vibe: string, hints?: Record<string, unknown>) {
  // Compose constraints
  const constraints = [
    "Tempo must be between 60 and 220 BPM.",
    "Include 1–5 genres.",
    "If possible, provide ~2 seed artists and at least 1 seed track.",
    "Reply only with JSON, no prose.",
  ];

  // Add hints if provided
  const hintsText = hints ? `Hints: ${JSON.stringify(hints)}` : "";

  // Build the prompt
  return [`Vibe: ${vibe}`, ...constraints, hintsText]
    .filter(Boolean)
    .join("\n");
}

export { SYSTEM, userPrompt };
