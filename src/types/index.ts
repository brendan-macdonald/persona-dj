/**
 * Shared type definitions for the Persona DJ application
 */

/**
 * Playlist specification with genre and audio feature parameters
 */
export interface PlaylistSpec {
  genres: string[];
  tempoRange: {
    min: number;
    max: number;
  };
  energy: number;
  danceability: number;
  valence: number;
  seedArtists?: string[];
  seedTracks?: string[];
  notes?: string;
}

/**
 * Spotify track with metadata and preview
 */
export interface Track {
  id: string;
  name: string;
  artists: string;
  preview_url?: string;
  uri: string;
}

export interface SearchStrategy {
  searchKeywords: string[];
  genrePriority: string[];
  yearRange: string | null;
  rationale: string;
}
