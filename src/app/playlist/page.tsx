"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, Shuffle } from "lucide-react";
import PageTransition from "@/components/PageTransition";

interface Track {
  id: string;
  uri: string;
  name: string;
  artists: string;
  preview_url: string | null;
  popularity: number;
}

export default function PlaylistPage() {
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedUris, setSelectedUris] = useState<string[]>([]);
  const [playlistName, setPlaylistName] = useState("My Awesome Mix");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("persona:discoveredTracks");
    const savedVibe = localStorage.getItem("persona:currentVibe");
    if (saved) {
      const loadedTracks = JSON.parse(saved);
      setTracks(loadedTracks);
      // Pre-select first 12 tracks
      setSelectedUris(loadedTracks.slice(0, 12).map((t: Track) => t.uri));
    }
    if (savedVibe) {
      setPlaylistName(`${savedVibe} Playlist`);
      setPlaylistDescription(
        `A curated playlist for: ${savedVibe}. Powered by Persona DJ.`
      );
    }
  }, []);

  function toggleTrack(uri: string) {
    setSelectedUris((prev) =>
      prev.includes(uri) ? prev.filter((u) => u !== uri) : [...prev, uri]
    );
  }

  function selectAll() {
    setSelectedUris(tracks.map((t) => t.uri));
  }

  function clearAll() {
    setSelectedUris([]);
  }

  function shuffleTracks() {
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setTracks(shuffled);
  }

  async function handlePostPlaylist() {
    if (selectedUris.length === 0) return;

    setLoading(true);
    try {
      const vibeId = localStorage.getItem("persona:vibeId");
      const res = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playlistName,
          description: playlistDescription,
          uris: selectedUris,
          vibeId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPlaylistUrl(data.url);
      }
    } catch (error) {
      console.error("Failed to create playlist:", error);
    } finally {
      setLoading(false);
    }
  }

  if (tracks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading tracks...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() => router.push("/spec-editor")}
              className="text-indigo-600 hover:text-indigo-700 mb-6 flex items-center gap-2 font-semibold transition-all duration-200 hover:gap-3"
            >
              ← Back
            </button>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-indigo-900 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight pb-1">
              Your Playlist
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Curate your perfect mix and share it with the world
            </p>
          </div>

          {/* Success Message */}
          {playlistUrl && (
            <div className="mb-8 bg-gradient-to-r from-green-50 via-green-100/80 to-emerald-50 border-2 border-green-300 rounded-3xl p-8 shadow-2xl shadow-green-200/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/40">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-green-900 font-extrabold mb-2 text-xl">
                    Playlist created successfully!
                  </p>
                  <a
                    href={playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Open in Spotify
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Playlist Details - Moved to top */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-8 mb-8 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Playlist Title
                </label>
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-200 font-semibold text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  placeholder="Add a description for your playlist..."
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl resize-none text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-200 font-medium"
                  rows={3}
                />
              </div>

              <button
                onClick={handlePostPlaylist}
                disabled={selectedUris.length === 0 || loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
              >
                {loading ? "Creating..." : "Post to Spotify"}
              </button>
            </div>
          </div>

          {/* Main Card - Track List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-8 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300">
            {/* Controls */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAll}
                  className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={shuffleTracks}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  Shuffle
                </button>
              </div>
              <div className="text-sm text-gray-600 font-semibold">
                {selectedUris.length} of {tracks.length} tracks selected
              </div>
            </div>

            {/* Track List */}
            <div className="space-y-2 mb-6">
              {tracks.map((track) => {
                const isSelected = selectedUris.includes(track.uri);
                return (
                  <div
                    key={track.id}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      isSelected ? "bg-indigo-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleTrack(track.uri)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {track.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {track.artists}
                      </p>
                    </div>
                    {track.preview_url && (
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Play className="w-4 h-4 text-indigo-600" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
