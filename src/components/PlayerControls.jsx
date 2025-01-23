import { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import '../assets/PlayerControls.css';

const PlayerControls = () => {
  const { state, dispatch } = usePlayer();

  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect();
    const seekPosition = (e.clientX - rect.left) / rect.width;
    const newTime = seekPosition * state.player.getDuration();
    state.player.seekTo(newTime, true);
    dispatch({ type: 'UPDATE_PROGRESS', payload: seekPosition * 100 });
  };

  const handleNext = () => {
    if (!state.playlist || state.playlist.length === 0 || !state.currentTrack) {
      console.error('Playlist is empty or currentTrack is null.');
      return;
    }

    const currentIndex = state.playlist.findIndex(
      (track) => track.id.videoId === state.currentTrack.id.videoId
    );

    if (currentIndex === -1) {
      console.error('Current track not found in playlist.');
      return;
    }

    const nextIndex = (currentIndex + 1) % state.playlist.length;
    const nextTrack = state.playlist[nextIndex];

    if (!nextTrack) {
      console.error('Next track not found in playlist.');
      return;
    }

    dispatch({ type: 'PLAY_TRACK', payload: nextTrack });
    state.player.loadVideoById(nextTrack.id.videoId);
    state.player.playVideo();
  };

  const handleBack = () => {
    if (!state.playlist || state.playlist.length === 0 || !state.currentTrack) {
      console.error('Playlist is empty or currentTrack is null.');
      return;
    }

    const currentIndex = state.playlist.findIndex(
      (track) => track.id.videoId === state.currentTrack.id.videoId
    );

    if (currentIndex === -1) {
      console.error('Current track not found in playlist.');
      return;
    }

    const prevIndex = (currentIndex - 1 + state.playlist.length) % state.playlist.length;
    const prevTrack = state.playlist[prevIndex];

    if (!prevTrack) {
      console.error('Previous track not found in playlist.');
      return;
    }

    dispatch({ type: 'PLAY_TRACK', payload: prevTrack });
    state.player.loadVideoById(prevTrack.id.videoId);
    state.player.playVideo();
  };

  // Handle automatic playback of the next song
  useEffect(() => {
    const handleStateChange = (event) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        handleNext();
      }
    };

    if (state.player) {
      state.player.addEventListener('onStateChange', handleStateChange);
    }

    return () => {
      if (state.player) {
        state.player.removeEventListener('onStateChange', handleStateChange);
      }
    };
  }, [state.player, state.playlist]);

  if (!state.currentTrack) return null;

  return (
    <div className="player-controls">
      <div className="track-info">
        <img 
          src={state.currentTrack.snippet.thumbnails.default.url} 
          alt={state.currentTrack.snippet.title} 
        />
        <div>
          <h4>{state.currentTrack.snippet.title}</h4>
          <p>{state.currentTrack.snippet.channelTitle}</p>
        </div>
      </div>
      
      <div className="progress-bar" onClick={handleSeek}>
        <div className="progress" style={{ width: `${state.progress}%` }}></div>
      </div>

      <div className="controls">
        <button className="back-btn" onClick={handleBack}>
          <FaStepBackward />
        </button>
        <button 
          className="play-pause"
          onClick={() => {
            if (state.isPlaying) {
              state.player.pauseVideo();
            } else {
              state.player.playVideo();
            }
            dispatch({ type: 'TOGGLE_PLAYBACK' });
          }}
        >
          {state.isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button className="next-btn" onClick={handleNext}>
          <FaStepForward />
        </button>
      </div>
    </div>
  );
};

export default PlayerControls;