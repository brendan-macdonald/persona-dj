import React, { useState } from "react";
import { Track } from "../types";

/**
 * @interface TrackListProps
 * Props for TrackList component.
 * tracks - Array of track objects to display.
 * selectedUris - Array of selected track URIs.
 * onSelectionChange - Callback to lift selected URIs up.
 */
interface TrackListProps {
  tracks: Track[];
  selectedUris: string[];
  onSelectionChange: (uris: string[]) => void;
}

/**
 * @component TrackList
 * Displays a list of tracks with selection and preview.
 */
export default function TrackList({
  tracks,
  selectedUris,
  onSelectionChange,
}: TrackListProps) {
  //local state for currenty previewed track
  const [previewing, setPreviewing] = useState<string | null>(null);

  //handle selection toggle
  function toggleSelect(uri: string) {
    const next = selectedUris.includes(uri)
      ? selectedUris.filter((u) => u !== uri)
      : [...selectedUris, uri];
    onSelectionChange(next);
  }

  return (
    <div className="space-y-3">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
        >
          <input
            type="checkbox"
            checked={selectedUris.includes(track.uri)}
            onChange={() => toggleSelect(track.uri)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white truncate">
              {track.name}
            </div>
            <div className="text-sm text-gray-400 truncate">
              {track.artists}
            </div>
          </div>
          {track.preview_url && (
            <button
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex-shrink-0"
              onClick={() => setPreviewing(track.id)}
              type="button"
            >
              Preview
            </button>
          )}
          {previewing === track.id && track.preview_url && (
            <audio
              src={track.preview_url}
              autoPlay
              controls
              onEnded={() => setPreviewing(null)}
              className="ml-2 h-8"
            />
          )}
        </div>
      ))}
    </div>
  );
}
