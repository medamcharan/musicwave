import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext'; // Import the player context
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa'; // Icons for play/pause and like
import '../assets/Albums.css';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [category, setCategory] = useState('telugu');
  const navigate = useNavigate();
  const { state, dispatch } = usePlayer(); // Access player state and dispatch

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const { data } = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              part: 'snippet',
              maxResults: 50,
              q: `${category} album`,
              type: 'video',
              key: API_KEY,
            },
          }
        );
        setAlbums(data.items);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();
  }, [category]);

  return (
    <div className="page">
      <h1>Top Albums</h1>
      <div className="category-buttons">
        {['telugu', 'hindi', 'english', 'tamil'].map((lang) => (
          <button
            key={lang}
            onClick={() => setCategory(lang)}
            className={category === lang ? 'active' : ''}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="music-grid">
        {albums.map((album) => (
          <MusicCard
            key={album.id.videoId}
            album={album}
            isPlaying={
              state.currentTrack?.id.videoId === album.id.videoId && state.isPlaying
            }
            isFavorite={state.favorites.includes(album.id.videoId)}
            onPlay={() => {
              if (!state.player) {
                console.error('YouTube player is not initialized.');
                return;
              }

              const videoId = album.id.videoId;

              if (state.currentTrack?.id.videoId === videoId && state.isPlaying) {
                state.player.pauseVideo();
                dispatch({ type: 'TOGGLE_PLAYBACK' });
              } else {
                if (state.currentTrack?.id.videoId !== videoId) {
                  state.player.loadVideoById(videoId);
                }
                state.player.playVideo();
                dispatch({ type: 'PLAY_TRACK', payload: album });
              }
            }}
            onToggleFavorite={() => {
              dispatch({
                type: state.favorites.includes(album.id.videoId)
                  ? 'REMOVE_FAVORITE'
                  : 'ADD_FAVORITE',
                payload: album.id.videoId,
              });
            }}
          />
        ))}
      </div>

      {/* Player Controls */}
      {state.currentTrack && (
        <div className="player-controls">
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${state.progress}%` }}
            ></div>
          </div>
          <div className="controls">
            <button
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
            <div className="track-info">
              <h4>{state.currentTrack.snippet.title}</h4>
              <p>{state.currentTrack.snippet.channelTitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MusicCard = ({ album, isPlaying, isFavorite, onPlay, onToggleFavorite }) => {
  return (
    <div className="music-card">
      <img src={album.snippet.thumbnails.medium.url} alt={album.snippet.title} />
      <div className="card-content">
        <h3>{album.snippet.title}</h3>
        <p>{album.snippet.channelTitle}</p>
        <div className="card-controls">
          <div className="control-group">
            <button className="play-button" onClick={onPlay}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <span className="control-label">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </div>
          <div className="control-group">
            <button
              className={`like-button ${isFavorite ? 'active' : ''}`}
              onClick={onToggleFavorite}
            >
              <FaHeart />
            </button>
            <span className="control-label">
              {isFavorite ? 'Liked' : 'Like'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Albums;