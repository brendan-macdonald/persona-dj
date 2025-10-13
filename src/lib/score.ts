// Scoring helper for comparing track features to a target spec
// Returns a score (higher = better) based on negative Euclidean distance

/**
 * scoreTrack - Compare track features to target spec
 * @param features - Object with track features (tempo, energy, danceability, valence)
 * @param target - Object with target features (same keys)
 * @returns number - Higher score means closer match
 */
function scoreTrack(
  features: {
    tempo: number;
    energy: number;
    danceability: number;
    valence?: number;
  },
  target: {
    tempo: number;
    energy: number;
    danceability: number;
    valence?: number;
  }
): number {
  // normalize tempo to a 0..1 scale (e.g. 60 = 0, 229 = 1)
  const norm = (tempo: number) => (tempo - 60) / (220 - 60);
  // Use valence or default to 0.5
  const valA = features.valence ?? 0.5;
  const valB = target.valence ?? 0.5;
  // Euclidean distance in normalized feature space
  const dist = Math.sqrt(
    Math.pow(norm(features.tempo) - norm(target.tempo), 2) +
      Math.pow(features.energy - target.energy, 2) +
      Math.pow(features.danceability - target.danceability, 2) +
      Math.pow(valA - valB, 2)
  );
  // Negative distance: higher score = better match (the closer the track is to the target, the higher the score)
  return -dist;
}
export { scoreTrack };
