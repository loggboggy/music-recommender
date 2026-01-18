import SongCard from './SongCard';

function SongList({ songs, searchedTrack }) {
  if (!songs || songs.length === 0) {
    return null;
  }

  return (
    <div className="song-list">
      <h2>
        Songs similar to "{searchedTrack.track}" by {searchedTrack.artist}
      </h2>
      <div className="songs-container">
        {songs.map((song, index) => (
          <SongCard key={`${song.name}-${song.artist}`} song={song} index={index} />
        ))}
      </div>
    </div>
  );
}

export default SongList;
