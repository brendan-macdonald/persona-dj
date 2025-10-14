"use client";

import { useState } from "react";
import VibeForm from "../components/VibeForm";
import SpecPreview from "../components/SpecPreview";
import TrackList from "../components/TrackList";
import { PlaylistSpec, Track } from "../types";

export default function Home() {
  // State for spec, tracks, selected uris, loading, error
  const [spec, setSpec] = useState<PlaylistSpec | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedUris, setSelectedUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle VibeForm translation: set spec from child
  async function handleVibeTranslate(vibe: string) {
    setLoading(true);
    setError("");
    setSpec(null);
    setTracks([]);
    setSelectedUris([]);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe }),
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

  // Handle SpecPreview change: call /api/recommend
  async function handleSpecChange(nextSpec: PlaylistSpec) {
    setSpec(nextSpec);
    setLoading(true);
    setError("");
    setTracks([]);
    setSelectedUris([]);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spec: nextSpec }),
      });

      const data = await res.json();

      if (res.ok && data.tracks) {
        setTracks(data.tracks);
      } else {
        setError(data.error || "Failed to get recommendations");
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
        {spec && <SpecPreview value={spec} onChange={handleSpecChange} />}
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
