"use client";
import React, { useState } from "react";

/**
 * @component VibeForm
 * Client component for translating a vibe description to a playlist spec.
 *   - Textarea for custom vibe input
 *   - Preset buttons for quick selection
 *   - "Translate" button triggers onTranslate callback
 */

// Preset vibe descriptions for quick selection
const presets = [
  "chill summer evening",
  "high energy workout",
  "romantic dinner",
  "focus study session",
];

interface VibeFormProps {
  onTranslate: (vibe: string) => void;
  loading?: boolean;
  error?: string;
}

export default function VibeForm({
  onTranslate,
  loading = false,
  error = "",
}: VibeFormProps) {
  // State for vibe input only
  const [vibe, setVibe] = useState("");

  /**
   * Trigger the parent's translate handler
   */
  function handleTranslate() {
    if (vibe.trim()) {
      onTranslate(vibe);
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Title */}
      <h2 className="text-xl font-bold mb-4 text-gray-900">
        Describe Your Vibe
      </h2>
      {/* Vibe input textarea */}
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
        rows={4}
        value={vibe}
        onChange={(e) => setVibe(e.target.value)}
        placeholder="Describe your vibe... (e.g., 'upbeat party music' or 'relaxing acoustic vibes')"
      />
      {/* Preset vibe buttons */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-700 mb-2">
          Quick Presets:
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              className="px-3 py-1.5 text-sm bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors"
              onClick={() => setVibe(preset)}
              type="button"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
      {/* Translate button */}
      <button
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors shadow-sm"
        onClick={handleTranslate}
        disabled={loading || !vibe.trim()}
        type="button"
      >
        {loading ? "Translating..." : "Translate to Playlist"}
      </button>
      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
