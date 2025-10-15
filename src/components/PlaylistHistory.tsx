"use client";

import { useState, useEffect } from "react";

interface Playlist {
  id: string;
  name: string;
  spotifyUrl: string;
  trackCount: number;
  createdAt: string;
  vibe: { inputText: string } | null;
}

export default function PlaylistHistory() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch playlists on mount
  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await fetch("/api/playlist-history");

        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Non-JSON response from /api/playlist-history:", text);
          setError("Server returned invalid response");
          return;
        }

        const data = await res.json();

        if (res.ok) {
          setPlaylists(data.playlists);
        } else {
          setError(data.error || "Failed to load playlists");
        }
      } catch (e) {
        console.error("Playlist fetch error:", e);
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
        <p className="text-gray-400">Loading your playlists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900 rounded-lg border border-red-700">
        <p className="text-red-200">Error: {error}</p>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
        <p className="text-gray-400">No playlists created yet.</p>
        <p className="text-sm text-gray-500 mt-2">
          Create your first playlist to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white mb-3">
        Your Playlists ({playlists.length})
      </h3>
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate">
                {playlist.name}
              </h4>
              {playlist.vibe && (
                <p className="text-sm text-gray-400 truncate">
                  Vibe: &ldquo;{playlist.vibe.inputText}&rdquo;
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {playlist.trackCount} tracks •{" "}
                {new Date(playlist.createdAt).toLocaleDateString()}
              </p>
            </div>
            <a
              href={playlist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors flex-shrink-0"
            >
              Open →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
