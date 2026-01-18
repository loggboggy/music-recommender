const API_KEY = import.meta.env.VITE_LASTFM_API_KEY || '6740cf9c5998bb89cf3c641c5ec48b57';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export async function getSimilarTracks(artist, track) {
  const params = new URLSearchParams({
    method: 'track.getSimilar',
    artist: artist,
    track: track,
    api_key: API_KEY,
    format: 'json',
    limit: 50,
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch similar tracks');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.message || 'Track not found');
  }

  if (!data.similartracks || !data.similartracks.track) {
    return [];
  }

  // Normalize artist name for comparison
  const normalize = (name) =>
    name.toLowerCase()
      .replace(/^the\s+/, '')
      .replace(/[^a-z0-9]/g, '');

  const inputArtistNorm = normalize(artist);

  // Also get the canonical artist name from the API response
  const canonicalArtist = data.similartracks['@attr']?.artist;
  const canonicalArtistNorm = canonicalArtist ? normalize(canonicalArtist) : null;

  return data.similartracks.track
    .filter((t) => {
      const trackArtistNorm = normalize(t.artist.name);
      // Filter out if it matches either the input or canonical artist name
      return trackArtistNorm !== inputArtistNorm &&
             trackArtistNorm !== canonicalArtistNorm;
    })
    .slice(0, 10)
    .map((t) => ({
      name: t.name,
      artist: t.artist.name,
      url: t.url,
      playcount: t.playcount,
      match: t.match,
    }));
}

export async function searchTrack(artist, track) {
  const params = new URLSearchParams({
    method: 'track.search',
    artist: artist,
    track: track,
    api_key: API_KEY,
    format: 'json',
    limit: 5,
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to search tracks');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.message || 'Search failed');
  }

  if (!data.results || !data.results.trackmatches || !data.results.trackmatches.track) {
    return [];
  }

  return data.results.trackmatches.track.map((track) => ({
    name: track.name,
    artist: track.artist,
    url: track.url,
  }));
}
