function SongCard({ song, index }) {
  const matchPercentage = song.match ? Math.round(song.match * 100) : null;

  return (
    <div className="song-card">
      <span className="song-number">{index + 1}</span>
      <div className="song-info">
        <h3 className="song-name">{song.name}</h3>
        <p className="song-artist">{song.artist}</p>
      </div>
      <div className="song-actions">
        {matchPercentage && (
          <span className="match-badge">{matchPercentage}% match</span>
        )}
        <a
          href={song.url}
          target="_blank"
          rel="noopener noreferrer"
          className="lastfm-link"
        >
          View on Last.fm
        </a>
      </div>
    </div>
  );
}

export default SongCard;
