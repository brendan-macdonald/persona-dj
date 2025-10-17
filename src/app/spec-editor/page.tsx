"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { PlaylistSpec } from "@/types";

export default function SpecEditorPage() {
  const router = useRouter();
  const [spec, setSpec] = useState<PlaylistSpec | null>(null);
  const [vibe, setVibe] = useState("");
  const [loading, setLoading] = useState(false);
  const [genreInput, setGenreInput] = useState("");

  useEffect(() => {
    // Load spec from localStorage
    const saved = localStorage.getItem("persona:currentSpec");
    const savedVibe = localStorage.getItem("persona:currentVibe");
    if (saved) {
      setSpec(JSON.parse(saved));
    }
    if (savedVibe) {
      setVibe(savedVibe);
    }
  }, []);

  function updateSpec(updates: Partial<PlaylistSpec>) {
    if (!spec) return;
    const updated = { ...spec, ...updates };
    setSpec(updated);
    localStorage.setItem("persona:currentSpec", JSON.stringify(updated));
  }

  function addGenre() {
    if (!spec || !genreInput.trim() || spec.genres.length >= 5) return;
    updateSpec({ genres: [...spec.genres, genreInput.trim()] });
    setGenreInput("");
  }

  function removeGenre(genre: string) {
    if (!spec) return;
    updateSpec({ genres: spec.genres.filter((g) => g !== genre) });
  }

  async function handleDiscover() {
    if (!spec) return;

    setLoading(true);
    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spec, vibe }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem(
          "persona:discoveredTracks",
          JSON.stringify(data.tracks)
        );
        router.push("/playlist");
      }
    } catch (error) {
      console.error("Discovery failed:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!spec) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading spec...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => router.push("/landing")}
            className="text-indigo-600 hover:text-indigo-700 mb-6 flex items-center gap-2 font-semibold transition-all duration-200 hover:gap-3"
          >
            ← Back
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-indigo-900 to-indigo-600 bg-clip-text text-transparent mb-3">
            Spec Editor
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Fine-tune your playlist specifications to generate the perfect
            tracks
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Tune your spec */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-8 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tune your spec
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              Adjust the parameters to match your desired music style
            </p>

            {/* Genres */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Genres
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {spec.genres.map((genre) => (
                  <span
                    key={genre}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {genre}
                    <button
                      onClick={() => removeGenre(genre)}
                      className="hover:bg-indigo-200 rounded-full p-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              {spec.genres.length < 5 && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addGenre()}
                    placeholder="Search and add genres..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-200 font-medium"
                  />
                </div>
              )}
            </div>

            {/* Tempo Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo (BPM)
                <span className="ml-2 text-indigo-600 font-semibold">
                  {spec.tempoRange.min} - {spec.tempoRange.max}
                </span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min="60"
                    max="200"
                    value={spec.tempoRange.min}
                    onChange={(e) =>
                      updateSpec({
                        tempoRange: {
                          ...spec.tempoRange,
                          min: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>60</span>
                    <span>200</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Energy */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy
                <span className="ml-2 text-indigo-600 font-semibold">
                  {spec.energy.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={spec.energy}
                onChange={(e) =>
                  updateSpec({ energy: parseFloat(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Danceability */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danceability
                <span className="ml-2 text-indigo-600 font-semibold">
                  {spec.danceability.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={spec.danceability}
                onChange={(e) =>
                  updateSpec({ danceability: parseFloat(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Valence (Mood) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valence (Mood)
                <span className="ml-2 text-indigo-600 font-semibold">
                  {spec.valence.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={spec.valence}
                onChange={(e) =>
                  updateSpec({ valence: parseFloat(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Sad</span>
                <span>Happy</span>
              </div>
            </div>
          </div>

          {/* Right: Spec Summary */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-8 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Spec Summary
              </h2>
              <p className="text-sm text-gray-600 mb-8">
                Current playlist specifications
              </p>

              <div className="space-y-6">
                <div>
                  <div className="text-sm font-bold text-gray-700 mb-2">
                    Genres
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {spec.genres.join(", ") || "None"}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold text-gray-700 mb-2">
                    Tempo
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {spec.tempoRange.min} - {spec.tempoRange.max} BPM
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Audio Features
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Energy</span>
                      <span className="text-sm font-semibold text-indigo-600">
                        {spec.energy.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Danceability
                      </span>
                      <span className="text-sm font-semibold text-indigo-600">
                        {spec.danceability.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valence</span>
                      <span className="text-sm font-semibold text-indigo-600">
                        {spec.valence.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Results */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 border border-indigo-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/30">
                  i
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-900 mb-1">
                    ~50-100 tracks match your criteria
                  </p>
                  <p className="text-xs text-indigo-700 font-medium">
                    We&apos;ll discover and rank the best matches
                  </p>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleDiscover}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
            >
              {loading ? "Discovering tracks..." : "Generate Playlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
