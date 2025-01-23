import { useEffect, useState } from 'react';
import axios from 'axios';
import MusicCard from '../components/MusicCard';
import SearchBar from '../components/SearchBar';
import { usePlayer } from '../context/PlayerContext';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const Home = () => {
  const { state, dispatch } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all'); // Default to 'all' for global search

  // Language-specific search terms and ISO 639-1 codes
  const languageTerms = {
    all: { term: 'song', code: '' }, // Global search
    telugu: { term: 'telugu song', code: 'te' },
    hindi: { term: 'hindi song', code: 'hi' },
    english: { term: 'english song', code: 'en' },
    tamil: { term: 'tamil song', code: 'ta' },
    malayalam: { term: 'malayalam song', code: 'ml' },
    kannada: { term: 'kannada song', code: 'kn' },
  };

  const searchVideos = async (query, language) => {
    try {
      let searchTerm = query.trim();
      if (language !== 'all') {
        searchTerm += ` ${languageTerms[language].term}`;
      }

      const encodedQuery = encodeURIComponent(searchTerm);
      const { data } = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
          params: {
            part: 'snippet',
            maxResults: 50,
            q: encodedQuery,
            type: 'video',
            key: API_KEY,
            videoCategoryId: 10, // Music category
            order: 'relevance',  // Sort by relevance
            relevanceLanguage: languageTerms[language].code || '', // Use ISO 639-1 code (empty for global search)
          },
        }
      );

      // Filter results to include only individual songs
      const filteredTracks = data.items.filter((item) => {
        const title = item.snippet.title.toLowerCase();
        return (
          !title.includes('playlist') && // Exclude playlists
          !title.includes('full album') && // Exclude full albums
          !title.includes('mix') && // Exclude mixes
          !title.includes('collection') // Exclude collections
        );
      });

      setTracks(filteredTracks);
    } catch (error) {
      console.error('YouTube API error:', error.response?.data || error.message);
    }
  };

  // Update the playlist in PlayerContext whenever tracks change
  useEffect(() => {
    if (tracks.length > 0) {
      dispatch({ type: 'SET_PLAYLIST', payload: tracks });
    }
  }, [tracks]);

  // Handle search query and category changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If search query is empty, show default results for the selected category
      searchVideos('latest', category);
    } else {
      // If search query is not empty, search for the query in the selected category
      searchVideos(searchQuery, category);
    }
  }, [searchQuery, category]);

  return (
    <div className="home-page">
      <SearchBar onSearch={setSearchQuery} searchHandler={(query) => searchVideos(query, category)} />
      <div className="category-buttons">
        {Object.keys(languageTerms).map((lang) => (
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
        {tracks.map((track) => (
          <MusicCard key={track.id.videoId} track={track} />
        ))}
      </div>
    </div>
  );
};

export default Home;