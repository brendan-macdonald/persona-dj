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
      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-gray-600">Loading your playlists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-xl border border-red-200">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
        <p className="text-gray-700 font-medium">No playlists created yet.</p>
        <p className="text-sm text-gray-500 mt-2">
          Create your first playlist to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Your Playlists ({playlists.length})
      </p>
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate mb-1">
                {playlist.name}
              </h4>
              {playlist.vibe && (
                <p className="text-sm text-gray-600 truncate mb-2">
                  Vibe: &ldquo;{playlist.vibe.inputText}&rdquo;
                </p>
              )}
              <p className="text-xs text-gray-500">
                {playlist.trackCount} tracks •{" "}
                {new Date(playlist.createdAt).toLocaleDateString()}
              </p>
            </div>
            <a
              href={playlist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0"
            >
              Open →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
