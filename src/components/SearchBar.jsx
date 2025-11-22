import { useState, useEffect } from 'react';
import { useDebounce } from '../Hooks/useDebounce';

function SearchBar({ onSearch, placeholder = "Поиск технологий..." }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="search-clear-btn"
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>
      
      {searchTerm && (
        <div className="search-info">
          <span>Поиск: "{searchTerm}"</span>
          {debouncedSearchTerm !== searchTerm && (
            <span className="search-loading">Поиск...</span>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;