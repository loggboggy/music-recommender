import { useState } from 'react';
import SearchBar from './components/SearchBar';
import SongList from './components/SongList';
import { getSimilarTracks } from './services/lastfm';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchedTrack, setSearchedTrack] = useState(null);

  const handleSearch = async (artist, track) => {
    setIsLoading(true);
    setError(null);
    setSongs([]);

    try {
      const similarTracks = await getSimilarTracks(artist, track);

      if (similarTracks.length === 0) {
        setError('No similar tracks found. Try a different song or check your spelling.');
      } else {
        setSongs(similarTracks);
        setSearchedTrack({ artist, track });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Music Recommender</h1>
        <p>Discover songs similar to your favorites</p>
      </header>

      <main className="main">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {error && <div className="error-message">{error}</div>}

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Finding similar songs...</p>
          </div>
        )}

        <SongList songs={songs} searchedTrack={searchedTrack} />

        {!songs.length && !isLoading && !error && (
          <div className="placeholder">
            <p>Enter an artist and song title to get personalized recommendations</p>
            <p className="hint">Try "Hey Jude" by "The Beatles"</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Powered by{' '}
          <a href="https://www.last.fm/api" target="_blank" rel="noopener noreferrer">
            Last.fm API
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
