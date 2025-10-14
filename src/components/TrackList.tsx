import React, { useState } from "react";
/**
 * @typedef Track
 * Represents a Spotify track with metadata and preview.
 */
type Track = {
  id: string;
  name: string;
  artists: string;
  preview_url?: string;
  uri: string;
};

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
    <div className="space-y-2">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center gap-3 p-2 border rounded"
        >
          <input
            type="checkbox"
            checked={selectedUris.includes(track.uri)}
            onChange={() => toggleSelect(track.uri)}
          />
          <div className="flex-1">
            <div className="font-semibold">{track.name}</div>
            <div className="text-xs text-gray-600">{track.artists}</div>
          </div>
          {track.preview_url && (
            <button
              className="px-2 py-1 bg-blue-100 rounded"
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
              className="ml-2"
            />
          )}
        </div>
      ))}
    </div>
  );
}
