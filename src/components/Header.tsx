import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onClear,
  isLoading,
  isDarkMode,
  onToggleTheme
}) => {
  const [query, setQuery] = useState('');

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
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <h1 className="header-title">Abhay Image Search</h1>
        
        <div className="header-actions">
          <form onSubmit={handleSubmit} className="header-search-form">
            <div className="header-search-container">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search photos…"
                className="header-search-input"
                disabled={isLoading}
                aria-label="Search for images"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="header-clear-button"
                  disabled={isLoading}
                  aria-label="Clear search"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="header-search-button"
                disabled={isLoading || !query.trim()}
                aria-label="Search"
              >
                {isLoading ? (
                  <div className="spinner small" aria-hidden="true"></div>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                )}
              </button>
            </div>
          </form>
          
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};
