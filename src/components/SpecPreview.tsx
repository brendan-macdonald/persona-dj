import React from "react";
import { PlaylistSpec } from "../types";

/**
 * @component SpecPreview
 * Panel for editing playlist spec:
 *   - Genre chips (select/deselect)
 *   - Sliders for tempo min/max, energy, danceability, valence
 *   - Emits onChange(spec) when spec changes
 *   - Fully controlled component (no internal state)
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
  onChange: (spec: PlaylistSpec) => void;
}

export default function SpecPreview({ value, onChange }: SpecPreviewProps) {
  // Update spec and emit change
  function updateSpec(patch: Partial<PlaylistSpec>) {
    const next = { ...value, ...patch };
    onChange(next);
  }

  // Toggle genre selection
  function toggleGenre(genre: string) {
    const genres = value.genres.includes(genre)
      ? value.genres.filter((g: string) => g !== genre)
      : [...value.genres, genre];
    updateSpec({ genres });
  }

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
                value.genres.includes(genre)
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
      {/* Sliders for spec values */}
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
              value={value.tempoMin}
              onChange={(e) => updateSpec({ tempoMin: Number(e.target.value) })}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{value.tempoMin} BPM</span>
          </div>
          <span className="text-gray-400">–</span>
          <div className="flex-1">
            <input
              type="range"
              min={value.tempoMin}
              max={200}
              value={value.tempoMax}
              onChange={(e) => updateSpec({ tempoMax: Number(e.target.value) })}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{value.tempoMax} BPM</span>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label className="block mb-2 font-semibold text-gray-700">
          Energy:{" "}
          <span className="font-normal text-gray-600">
            {value.energy.toFixed(2)}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value.energy}
          onChange={(e) => updateSpec({ energy: Number(e.target.value) })}
          className="w-full"
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 font-semibold text-gray-700">
          Danceability:{" "}
          <span className="font-normal text-gray-600">
            {value.danceability.toFixed(2)}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value.danceability}
          onChange={(e) => updateSpec({ danceability: Number(e.target.value) })}
          className="w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block mb-2 font-semibold text-gray-700">
          Valence (Mood):{" "}
          <span className="font-normal text-gray-600">
            {value.valence.toFixed(2)}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value.valence}
          onChange={(e) => updateSpec({ valence: Number(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  );
}
