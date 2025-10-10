"use client";

import { useState } from "react";

const PRESETS = [
  "Deep Focus",
  "Sunset Drive",
  "Warehouse Techno",
  "Morning Chill",
];

export default function Home() {
  // State for the textarea and JSON preview
  const [vibe, setVibe] = useState("");
  const [jsonPreview, setJsonPreview] = useState(null);

  // Handler for preset buttons
  function handlePreset(preset: string) {
    setVibe(preset);
  }

  // Handler for Translate button (stub)
  function handleTranslate() {
    // Stub: just show a fake JSON preview
    setJsonPreview({
      vibe,
      playlist: ["Track 1", "Track 2", "Track 3"],
      mood: "Stubbed mood",
    });
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[80vh] w-full max-w-4xl mx-auto py-12 px-4">
      {/* Left panel: Input */}
      <section className="flex-1 flex flex-col gap-6">
        <label htmlFor="vibe" className="text-lg font-semibold mb-2">
          Enter your vibe…
        </label>
        <textarea
          id="vibe"
          className="w-full min-h-[100px] rounded-lg border border-gray-700 bg-gray-900 text-white p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          placeholder="Describe your mood, genre, or energy…"
        />
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className="bg-gray-800 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-medium"
              onClick={() => handlePreset(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          onClick={handleTranslate}
        >
          Translate
        </button>
      </section>
      {/* Right panel: JSON Preview */}
      <aside className="flex-1 bg-gray-950 border border-gray-800 rounded-lg p-6 overflow-auto min-h-[200px]">
        <h2 className="text-lg font-semibold mb-4">JSON Preview</h2>
        <pre className="text-sm text-green-400 whitespace-pre-wrap">
          {jsonPreview
            ? JSON.stringify(jsonPreview, null, 2)
            : "// Your playlist JSON will appear here"}
        </pre>
      </aside>
    </div>
  );
}
