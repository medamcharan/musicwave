import { useState } from 'react';
import '../assets/SearchBar.css';

const SearchBar = ({ onSearch, searchHandler }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query); // Update the search query in the parent component
    searchHandler(query); // Trigger the search handler
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search songs, artists, albums..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;