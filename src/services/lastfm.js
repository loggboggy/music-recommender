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

async function getSimilarArtists(artist) {
  const params = new URLSearchParams({
    method: 'artist.getSimilar',
    artist: artist,
    api_key: API_KEY,
    format: 'json',
    limit: 10,
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  if (data.error || !data.similarartists || !data.similarartists.artist) {
    return [];
  }

  return data.similarartists.artist.map((a) => a.name);
}

async function getArtistTopTrack(artist) {
  const params = new URLSearchParams({
    method: 'artist.getTopTracks',
    artist: artist,
    api_key: API_KEY,
    format: 'json',
    limit: 1,
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (data.error || !data.toptracks || !data.toptracks.track || !data.toptracks.track[0]) {
    return null;
  }

  const track = data.toptracks.track[0];
  return {
    name: track.name,
    artist: track.artist.name,
    url: track.url,
    playcount: track.playcount,
  };
}

export async function getRecommendations(artist, track) {
  // First try track-based recommendations
  let similarTracks = [];
  try {
    similarTracks = await getSimilarTracks(artist, track);
  } catch (err) {
    // Track not found or API error - will fall back to artist-based
  }

  if (similarTracks.length > 0) {
    return { tracks: similarTracks, fallback: false };
  }

  // Fallback: get similar artists and their top tracks
  const similarArtists = await getSimilarArtists(artist);

  if (similarArtists.length === 0) {
    return { tracks: [], fallback: true };
  }

  const trackPromises = similarArtists.map((a) => getArtistTopTrack(a));
  const tracks = await Promise.all(trackPromises);

  const validTracks = tracks.filter((t) => t !== null);

  return { tracks: validTracks, fallback: true };
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
