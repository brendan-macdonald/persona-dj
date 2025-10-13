// OpenAI integration for playlist spec generation
import { PlaylistSpec, clampSpec, PlaylistSpecT } from "./specs";
import { SYSTEM, userPrompt } from "./prompt";

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

export { vibeToSpec };
