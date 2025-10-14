import React, { useState } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @component SpecPreview
 * Panel for editing playlist spec:
 *   - Genre chips (select/deselect)
 *   - Sliders for tempo min/max, energy, danceability, valence
 *   - Emits onChange(spec) when spec changes
 *   - No LLM calls
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

export default function SpecPreview({
  value,
  onChange,
}: {
  value: any;
  onChange: (spec: any) => void;
}) {
  // Local state for spec, initialized from value
  const [spec, setSpec] = useState<any>(
    value || {
      genres: [],
      tempoMin: 80,
      tempoMax: 160,
      energy: 0.5,
      danceability: 0.5,
      valence: 0.5,
    }
  );

  // Update spec and emit change
  function updateSpec(patch: Partial<typeof spec>) {
    const next = { ...spec, ...patch };
    setSpec(next);
    onChange(next);
  }

  // Toggle genre selection
  function toggleGenre(genre: string) {
    const genres = spec.genres.includes(genre)
      ? spec.genres.filter((g: string) => g !== genre)
      : [...spec.genres, genre];
    updateSpec({ genres });
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      {/* Genre chips */}
      <div className="mb-4">
        <div className="font-semibold mb-2">Genres</div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`px-3 py-1 rounded border ${
                spec.genres.includes(genre)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
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
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Tempo (min/max)</label>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min={40}
            max={200}
            value={spec.tempoMin}
            onChange={(e) => updateSpec({ tempoMin: Number(e.target.value) })}
            className="w-32"
          />
          <span className="text-xs">{spec.tempoMin} BPM</span>
          <input
            type="range"
            min={spec.tempoMin}
            max={200}
            value={spec.tempoMax}
            onChange={(e) => updateSpec({ tempoMax: Number(e.target.value) })}
            className="w-32"
          />
          <span className="text-xs">{spec.tempoMax} BPM</span>
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Energy</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={spec.energy}
          onChange={(e) => updateSpec({ energy: Number(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs">{spec.energy}</span>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Danceability</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={spec.danceability}
          onChange={(e) => updateSpec({ danceability: Number(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs">{spec.danceability}</span>
      </div>
      <div className="mb-2">
        <label className="block mb-1 font-semibold">Valence</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={spec.valence}
          onChange={(e) => updateSpec({ valence: Number(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs">{spec.valence}</span>
      </div>
    </div>
  );
}
