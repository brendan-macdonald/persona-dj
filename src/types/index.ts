/**
 * Shared type definitions for the Persona DJ application
 */

/**
 * Playlist specification with genre and audio feature parameters
 */
export interface PlaylistSpec {
  genres: string[];
  tempoMin: number;
  tempoMax: number;
  energy: number;
  danceability: number;
  valence: number;
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
