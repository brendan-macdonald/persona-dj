// OpenAI integration for playlist spec generation
import { clampSpec, PlaylistSpecT } from "./specs";
import { SYSTEM, userPrompt } from "./prompt";
import { SearchStrategy } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Read API key from environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) throw new Error("Missing OpenAI API key...");

// Call OpenAI chat completions API
async function callOpenAI(messages: any[]) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

// Generate and validate playlist spec from vibe using OpenAI
async function vibeToSpec(
  vibe: string,
  hints?: Record<string, unknown>
): Promise<PlaylistSpecT> {
  const messages = [
    { role: "system", content: SYSTEM },
    { role: "user", content: userPrompt(vibe, hints) },
  ];

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const content = await callOpenAI(messages);
      const parsed = JSON.parse(content);
      const validated = clampSpec(parsed);
      return validated;
    } catch (e) {
      if (attempt === 1)
        throw new Error("Failed to retrieve valid playlist spec from OpenAI");
    }
  }
  throw new Error("Unexpected error in vibeToSpec");
}

// Convert vibe and spec into search strategy using LLM
async function vibeToSearchStrategy(
  vibe: string,
  spec: PlaylistSpecT
): Promise<SearchStrategy> {
  const prompt = `You are a music discovery expert. Create a search strategy to find tracks matching this vibe.

User's Vibe Description: "${vibe}"

Target Specifications:
- Energy Level: ${spec.energy} (0.0=calm/ambient, 1.0=intense/aggressive)
- Mood (Valence): ${spec.valence} (0.0=sad/dark, 1.0=happy/uplifting)  
- Tempo Range: ${spec.tempoRange.min}-${spec.tempoRange.max} BPM
- Base Genres: ${spec.genres.join(", ")}
- Seed Artists: ${spec.seedArtists?.join(", ") || "none"}

Generate 3-5 descriptive keywords that capture the vibe's energy, mood, and feel.
Prioritize/expand genres that match the energy and mood levels.
Suggest year ranges based on production style (newer=crisper/energetic, older=warmer/nostalgic).

Examples:
- High energy (0.8) + happy (0.7) → keywords: ["energetic", "uplifting", "power"], genres: ["electronic", "pop"], year: "2020-2024"
- Low energy (0.2) + sad (0.3) → keywords: ["melancholic", "calm", "emotional"], genres: ["indie", "acoustic"], year: "2010-2020"

Return JSON only:
{
  "searchKeywords": ["keyword1", "keyword2", "keyword3"],
  "genrePriority": ["genre1", "genre2", "genre3"],
  "yearRange": "2020-2024" or null,
  "rationale": "brief explanation"
}`;

  const messages = [{ role: "user", content: prompt }];

  try {
    const content = await callOpenAI(messages);
    const strategy: SearchStrategy = JSON.parse(content);

    console.log("[LLM] Search strategy:", strategy);

    return strategy;
  } catch (error) {
    console.error("[LLM] Failed to generate search strategy:", error);
    // Fallback strategy based on spec
    return {
      searchKeywords:
        spec.energy > 0.6 ? ["energetic", "upbeat"] : ["chill", "relaxing"],
      genrePriority: spec.genres,
      yearRange: null,
      rationale: "Fallback strategy due to LLM error",
    };
  }
}

export { vibeToSpec, vibeToSearchStrategy };
