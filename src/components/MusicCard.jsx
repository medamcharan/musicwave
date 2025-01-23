import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa';

const MusicCard = ({ track }) => {
  const { state, dispatch } = usePlayer();
  const videoId = track.id.videoId;
  const isPlaying = state.currentTrack?.id.videoId === videoId && state.isPlaying;
  const isFavorite = state.favorites.includes(videoId);

  const handlePlay = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!state.player) {
      console.error('YouTube player is not initialized.');
      return;
    }

    if (isPlaying) {
      state.player.pauseVideo();
      dispatch({ type: 'TOGGLE_PLAYBACK' });
    } else {
      if (state.currentTrack?.id.videoId !== videoId) {
        state.player.loadVideoById(videoId);
      }
      state.player.playVideo();
      dispatch({ type: 'PLAY_TRACK', payload: track });
    }
  };

  const toggleFavorite = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    dispatch({
      type: isFavorite ? 'REMOVE_FAVORITE' : 'ADD_FAVORITE',
      payload: videoId,
    });
  };

  return (
    <div className="music-card" onClick={handlePlay}>
      <img src={track.snippet.thumbnails.medium.url} alt={track.snippet.title} />
      <div className="card-content">
        <h3>{track.snippet.title}</h3>
        <p>{track.snippet.channelTitle}</p>
        <div className="card-controls">
          <button onClick={handlePlay} className="play-btn">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={toggleFavorite}
            className={`fav-btn ${isFavorite ? 'active' : ''}`}
          >
            <FaHeart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;