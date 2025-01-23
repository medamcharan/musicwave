import { useEffect, useState } from 'react';
import axios from 'axios';
import MusicCard from '../components/MusicCard';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const Singers = () => {
  const [singers, setSingers] = useState([]);
  const [category, setCategory] = useState('telugu');

  useEffect(() => {
    const fetchSingers = async () => {
      try {
        const { data } = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              part: 'snippet',
              maxResults: 50,
              q: `${category} singer`,
              type: 'video',
              key: API_KEY,
            },
          }
        );

        // Use only the fetched data from the API
        setSingers(data.items);
      } catch (error) {
        console.error('Error fetching singers:', error);
      }
    };

    fetchSingers();
  }, [category]);

  return (
    <div className="page">
      <h1>Top Singers</h1>
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
        {singers.map((singer) => (
          <MusicCard key={singer.id.videoId} track={singer} />
        ))}
      </div>
    </div>
  );
};

export default Singers;