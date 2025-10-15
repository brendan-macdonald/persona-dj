"use client";

import { useState } from "react";
import VibeForm from "../components/VibeForm";
import SpecPreview from "../components/SpecPreview";
import TrackList from "../components/TrackList";
import { PlaylistSpec, Track } from "../types";

export default function Home() {
  // State for spec, tracks, selected uris, loading, error
  const [spec, setSpec] = useState<PlaylistSpec | null>(null);
  const [vibe, setVibe] = useState<string>(""); // ADD THIS LINE
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedUris, setSelectedUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [playlistGenerated, setPlaylistGenerated] = useState(false); // Track if playlist was generated

  // Handle VibeForm translation: set spec from child
  async function handleVibeTranslate(vibeInput: string) {
    setLoading(true);
    setError("");
    setSpec(null);
    setTracks([]);
    setSelectedUris([]);
    setVibe(vibeInput);
    setPlaylistGenerated(false);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe: vibeInput }),
      });

      const data = await res.json();

      if (res.ok && data.spec) {
        setSpec(data.spec);
      } else {
        setError(data.error || "Failed to translate vibe");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  // Handle spec change from SpecPreview (Update Specifications button)
  function handleSpecChange(nextSpec: PlaylistSpec) {
    setSpec(nextSpec);
    setPlaylistGenerated(false);
  }

  // Generate playlist: call /api/discover with current spec
  async function handleGeneratePlaylist() {
    if (!spec) return;

    setLoading(true);
    setError("");
    setTracks([]);
    setSelectedUris([]);

    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spec: spec,
          vibe: vibe,
        }),
      });

      const data = await res.json();

      if (res.ok && data.tracks) {
        setTracks(data.tracks);
        setPlaylistGenerated(true);
      } else {
        setError(data.error || "Failed to discover tracks");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  // Handle track selection change
  function handleSelectionChange(uris: string[]) {
    setSelectedUris(uris);
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[80vh] w-full max-w-6xl mx-auto py-12 px-4">
      {/* Left panel: VibeForm for vibe input and translation */}
      <section className="flex-1 flex flex-col gap-6">
        <VibeForm
          onTranslate={handleVibeTranslate}
          loading={loading}
          error={error}
        />
        {/* SpecPreview panel, shown after spec is set */}
        {spec && (
          <>
            <SpecPreview value={spec} onSpecChange={handleSpecChange} />
            {/* Generate Playlist button */}
            <button
              onClick={handleGeneratePlaylist}
              disabled={playlistGenerated || loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                playlistGenerated || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-red-700"
              }`}
            >
              {loading
                ? "Generating..."
                : playlistGenerated
                ? "Playlist Generated"
                : "Generate Playlist"}
            </button>
          </>
        )}
      </section>
      {/* Right panel: TrackList and states */}
      <aside className="flex-1 bg-gray-950 border border-gray-800 rounded-lg p-6 overflow-auto min-h-[200px]">
        <h2 className="text-lg font-semibold mb-4 text-white">Tracks</h2>
        {loading && <div className="text-blue-400 mb-4">Loading…</div>}
        {tracks.length > 0 && (
          <TrackList
            tracks={tracks}
            selectedUris={selectedUris}
            onSelectionChange={handleSelectionChange}
          />
        )}
        {!loading && !error && tracks.length === 0 && (
          <pre className="text-sm text-green-400 whitespace-pre-wrap">
            {/* Show spec JSON if available, else placeholder */}
            {spec
              ? JSON.stringify(spec, null, 2)
              : "// Your playlist JSON will appear here"}
          </pre>
        )}
      </aside>
    </div>
  );
}
