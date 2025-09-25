import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading: boolean;
  initialQuery?: string;
}

const QUICK_CHIPS = ['nature', 'mountains', 'city', 'cats', 'flowers'];

export const SearchBar = ({ onSearch, onClear, isLoading, initialQuery = '' }: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="search-hero">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search high-quality photos (e.g., cats, mountains)"
            className="search-input"
            disabled={isLoading}
            aria-label="Search for images"
          />
          <div className="button-group">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="clear-button"
                disabled={isLoading}
                aria-label="Clear search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="search-button"
              disabled={isLoading || !query.trim()}
              aria-label="Search"
            >
              {isLoading ? (
                <div className="spinner" aria-hidden="true"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className="quick-chips">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            className="chip"
            onClick={() => onSearch(chip)}
            disabled={isLoading}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};
