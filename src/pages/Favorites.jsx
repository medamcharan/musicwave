import { useEffect, useState } from 'react';
import axios from 'axios';
import MusicCard from '../components/MusicCard';
import { usePlayer } from '../context/PlayerContext';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const Favorites = () => {
  const { state, dispatch } = usePlayer(); // Add dispatch to control playback
  const [favoriteTracks, setFavoriteTracks] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (state.favorites.length === 0) {
        setFavoriteTracks([]); // Clear favorites if none exist
        return;
      }

      const requests = state.favorites.map(videoId => 
        axios.get(
          'https://www.googleapis.com/youtube/v3/videos',
          {
            params: {
              part: 'snippet',
              id: videoId,
              key: API_KEY,
            },
          }
        )
      );
      
      try {
        const responses = await Promise.all(requests);
        const tracks = responses.map(res => ({
          id: { videoId: res.data.items[0].id },
          snippet: res.data.items[0].snippet,
        }));
        setFavoriteTracks(tracks);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [state.favorites]);

  return (
    <div className="page">
      <h1>Your Favorites</h1>
      {favoriteTracks.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <div className="music-grid">
          {favoriteTracks.map(track => (
            <MusicCard
              key={track.id.videoId}
              track={track}
              isPlaying={
                state.currentTrack?.id.videoId === track.id.videoId && state.isPlaying
              }
              onPlay={() => {
                if (!state.player) {
                  console.error('YouTube player is not initialized.');
                  return;
                }

                const videoId = track.id.videoId;

                if (state.currentTrack?.id.videoId === videoId && state.isPlaying) {
                  state.player.pauseVideo();
                  dispatch({ type: 'TOGGLE_PLAYBACK' });
                } else {
                  if (state.currentTrack?.id.videoId !== videoId) {
                    state.player.loadVideoById(videoId);
                  }
                  state.player.playVideo();
                  dispatch({ type: 'PLAY_TRACK', payload: track });
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;