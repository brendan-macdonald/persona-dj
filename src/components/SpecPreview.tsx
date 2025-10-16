import React, { useState } from "react";
import { PlaylistSpec } from "../types";

/**
 * @component SpecPreview
 * Panel for editing playlist spec:
 *   - Genre chips (select/deselect)
 *   - Sliders for tempo min/max, energy, danceability, valence
 *   - "Update Recommendations" button triggers onChange
 *   - Tracks local changes until button is clicked
 */
const genres = [
  "pop",
  "rock",
  "hip-hop",
  "electronic",
  "jazz",
  "classical",
  "country",
  "indie",
];

interface SpecPreviewProps {
  value: PlaylistSpec;
  onSpecChange: (spec: PlaylistSpec) => void;
}

export default function SpecPreview({ value, onSpecChange }: SpecPreviewProps) {
  //local state (user edits spec w/o triggering api)
  const [localSpec, setLocalSpec] = useState(value);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Validate spec and show warnings
  function validateSpec(spec: PlaylistSpec): string[] {
    const warnings: string[] = [];

    // Check tempo range
    if (spec.tempoRange.min >= spec.tempoRange.max) {
      warnings.push("Tempo minimum must be less than maximum");
    }

    // Warn about extreme values
    if (spec.tempoRange.max > 200) {
      warnings.push("Very high tempo (>200 BPM) may limit results");
    }
    if (spec.tempoRange.min < 60) {
      warnings.push("Very low tempo (<60 BPM) may limit results");
    }

    return warnings;
  }

  // Update local spec
  function updateLocalSpec(patch: Partial<PlaylistSpec>) {
    const updated = { ...localSpec, ...patch };
    setLocalSpec(updated);
    setHasChanges(true);
    setValidationWarnings(validateSpec(updated));
  }

  // Toggle genre selection
  function toggleGenre(genre: string) {
    const genres = localSpec.genres.includes(genre)
      ? localSpec.genres.filter((g: string) => g !== genre)
      : [...localSpec.genres, genre];
    updateLocalSpec({ genres });
  }

  // Update specifications (not generate playlist)
  function handleUpdateSpecifications() {
    const warnings = validateSpec(localSpec);
    if (warnings.length > 0) {
      setValidationWarnings(warnings);
      return; // Don't update if invalid
    }
    onSpecChange(localSpec);
    setHasChanges(false);
    setValidationWarnings([]);
  }

  const isValid = validateSpec(localSpec).length === 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Refine Your Playlist</h2>

      {/* Genre chips */}
      <div className="mb-6">
        <div className="font-semibold mb-3 text-gray-700">Genres</div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                localSpec.genres.includes(genre)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => toggleGenre(genre)}
              type="button"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Tempo Range */}
      <div className="mb-5">
        <label className="block mb-2 font-semibold text-gray-700">
          Tempo Range
        </label>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="range"
              min={40}
              max={200}
              value={localSpec.tempoRange.min}
              onChange={(e) =>
                updateLocalSpec({
                  tempoRange: {
                    ...localSpec.tempoRange,
                    min: Number(e.target.value),
                  },
                })
              }
              className="w-full"
            />
            <span className="text-sm text-gray-600">
              {localSpec.tempoRange.min} BPM
            </span>
          </div>
          <span className="text-gray-400">–</span>
          <div className="flex-1">
            <input
              type="range"
              min={localSpec.tempoRange.min}
              max={200}
              value={localSpec.tempoRange.max}
              onChange={(e) =>
                updateLocalSpec({
                  tempoRange: {
                    ...localSpec.tempoRange,
                    max: Number(e.target.value),
                  },
                })
              }
              className="w-full"
            />
            <span className="text-sm text-gray-600">
              {localSpec.tempoRange.max} BPM
            </span>
          </div>
        </div>
      </div>

      {/* Energy */}
      <div className="mb-5">
        <label className="block mb-2 font-semibold text-gray-700">
          Energy:{" "}
          <span className="font-normal text-gray-600">
            {localSpec.energy.toFixed(2)}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={localSpec.energy}
          onChange={(e) => updateLocalSpec({ energy: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Danceability */}
      <div className="mb-5">
        <label className="block mb-2 font-semibold text-gray-700">
          Danceability:{" "}
          <span className="font-normal text-gray-600">
            {localSpec.danceability.toFixed(2)}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={localSpec.danceability}
          onChange={(e) =>
            updateLocalSpec({ danceability: Number(e.target.value) })
          }
          className="w-full"
        />
      </div>

      {/* Valence */}
      <div className="mb-5">
        <label className="block mb-2 font-semibold text-gray-700">
          Valence (Mood):{" "}
          <span className="font-normal text-gray-600">
            {localSpec.valence.toFixed(2)}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={localSpec.valence}
          onChange={(e) => updateLocalSpec({ valence: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Validation warnings */}
      {validationWarnings.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
          <div className="font-semibold text-yellow-800 text-sm mb-1">
            ⚠️ Validation Warnings:
          </div>
          <ul className="text-sm text-yellow-700 list-disc list-inside">
            {validationWarnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Update Specifications button */}
      <button
        onClick={handleUpdateSpecifications}
        disabled={!hasChanges || !isValid}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          hasChanges && isValid
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {!isValid
          ? "Fix Warnings to Update"
          : hasChanges
          ? "Update Specifications"
          : "No Changes"}
      </button>
    </div>
  );
}
