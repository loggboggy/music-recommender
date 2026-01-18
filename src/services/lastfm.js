const API_KEY = import.meta.env.VITE_LASTFM_API_KEY || '6740cf9c5998bb89cf3c641c5ec48b57';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export async function getSimilarTracks(artist, track) {
  const params = new URLSearchParams({
    method: 'track.getSimilar',
    artist: artist,
    track: track,
    api_key: API_KEY,
    format: 'json',
    limit: 10,
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

  return data.similartracks.track.map((track) => ({
    name: track.name,
    artist: track.artist.name,
    url: track.url,
    playcount: track.playcount,
    match: track.match,
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
