import { createContext, useContext, useReducer, useEffect } from 'react';

const PlayerContext = createContext();

const initialState = {
  currentTrack: null,
  isPlaying: false,
  player: null,
  progress: 0,
  playlist: [],
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT_PLAYER':
      return { ...state, player: action.payload };
    case 'PLAY_TRACK':
      return { ...state, currentTrack: action.payload, isPlaying: true };
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload };
    case 'TOGGLE_PLAYBACK':
      return { ...state, isPlaying: !state.isPlaying };
    case 'UPDATE_PROGRESS':
      return { ...state, progress: action.payload };
    case 'ADD_FAVORITE':
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    case 'REMOVE_FAVORITE':
      const filtered = state.favorites.filter((id) => id !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(filtered));
      return { ...state, favorites: filtered };
    default:
      return state;
  }
};

export const PlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        events: {
          onReady: (event) => {
            console.log('YouTube player is ready');
            dispatch({ type: 'INIT_PLAYER', payload: event.target });
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              const interval = setInterval(() => {
                const progress =
                  (event.target.getCurrentTime() / event.target.getDuration()) * 100;
                dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
              }, 1000);
              return () => clearInterval(interval);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              dispatch({ type: 'TOGGLE_PLAYBACK' });
            } else if (event.data === window.YT.PlayerState.ENDED) {
              dispatch({ type: 'TOGGLE_PLAYBACK' });
              dispatch({ type: 'PLAY_TRACK', payload: null }); // Reset current track
            }
          },
        },
      });
    };
  }, []);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
      <div id="youtube-player" style={{ display: 'none' }}></div>
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);