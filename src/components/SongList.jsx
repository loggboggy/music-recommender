import SongCard from './SongCard';

function SongList({ songs, searchedTrack, isFallback }) {
  if (!songs || songs.length === 0) {
    return null;
  }

  return (
    <div className="song-list">
      <h2>
        {isFallback
          ? `Top tracks from artists similar to ${searchedTrack.artist}`
          : `Songs similar to "${searchedTrack.track}" by ${searchedTrack.artist}`}
      </h2>
      {isFallback && (
        <p className="fallback-note">
          No similar tracks found for this song, showing artist-based recommendations instead.
        </p>
      )}
      <div className="songs-container">
        {songs.map((song, index) => (
          <SongCard key={`${song.name}-${song.artist}`} song={song} index={index} />
        ))}
      </div>
    </div>
  );
}

export default SongList;
