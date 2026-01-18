import { useState } from 'react';

function SearchBar({ onSearch, isLoading }) {
  const [artist, setArtist] = useState('');
  const [track, setTrack] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (artist.trim() && track.trim()) {
      onSearch(artist.trim(), track.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          placeholder="Artist name"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Song title"
          value={track}
          onChange={(e) => setTrack(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={isLoading || !artist.trim() || !track.trim()}>
        {isLoading ? 'Searching...' : 'Find Similar Songs'}
      </button>
    </form>
  );
}

export default SearchBar;
