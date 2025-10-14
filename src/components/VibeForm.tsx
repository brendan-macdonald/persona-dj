"use client";
import React, { useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @component VibeForm
 * Client component for translating a vibe description to a playlist spec.
 *   - Textarea for custom vibe input
 *   - Preset buttons for quick selection
 *   - "Translate" button calls /api/translate
 *   - Displays pretty-printed JSON of returned spec
 */

// Preset vibe descriptions for quick selection
const presets = [
  "chill summer evening",
  "high energy workout",
  "romantic dinner",
  "focus study session",
];

export default function VibeForm() {
  // State for vibe input, returned spec, loading, and error
  const [vibe, setVibe] = useState("");
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Calls /api/translate with the current vibe
   * Sets loading, handles errors, and updates spec state
   */
  async function handleTranslate() {
    setLoading(true);
    setError("");
    setSpec(null);
    try {
      // POST vibe to API
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update spec with result
        setSpec(data.spec);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      {/* Title */}
      <h2 className="text-xl font-bold mb-4">Vibe to Playlist Spec</h2>
      {/* Vibe input textarea */}
      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={3}
        value={vibe}
        onChange={(e) => setVibe(e.target.value)}
        placeholder="Describe your vibe..."
      />
      {/* Preset vibe buttons */}
      <div className="flex gap-2 mb-2">
        {presets.map((preset) => (
          <button
            key={preset}
            className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
            onClick={() => setVibe(preset)}
            type="button"
          >
            {preset}
          </button>
        ))}
      </div>
      {/* Translate button */}
      <button
        className="w-full py-2 bg-blue-600 text-white rounded font-semibold"
        onClick={handleTranslate}
        disabled={loading || !vibe}
        type="button"
      >
        {loading ? "Translating..." : "Translate"}
      </button>
      {/* Error message */}
      {error && <div className="mt-4 text-red-600">Error: {error}</div>}
      {/* Pretty-printed spec output */}
      {spec && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
          {JSON.stringify(spec, null, 2)}
        </pre>
      )}
    </div>
  );
}
