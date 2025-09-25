import { useState, useEffect, useRef, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { Gallery } from './components/Gallery';
import { type UnsplashPhoto, searchPhotos } from './lib/unsplash';
import './App.css';

function App() {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load saved query from localStorage on mount
  useEffect(() => {
    const savedQuery = localStorage.getItem('lastSearchQuery');
    if (savedQuery) {
      setCurrentQuery(savedQuery);
      // Don't auto-search on load, just set the query
    }
  }, []);

  const handleSearch = useCallback(async (query: string, page = 1, append = false) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchPhotos(
        query, 
        page, 
        24, 
        abortControllerRef.current.signal
      );

      if (append) {
        setPhotos(prev => [...prev, ...response.results]);
      } else {
        setPhotos(response.results);
        setCurrentPage(1);
      }

      setHasMore(page < response.total_pages);
      setCurrentQuery(query);
      
      // Save query to localStorage
      localStorage.setItem('lastSearchQuery', query);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled, don't update state
      }
      
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      if (!append) {
        setPhotos([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    if (currentQuery && !isLoading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      handleSearch(currentQuery, nextPage, true);
    }
  }, [currentQuery, isLoading, hasMore, currentPage, handleSearch]);

  const handleRetry = useCallback(() => {
    if (currentQuery) {
      handleSearch(currentQuery);
    }
  }, [currentQuery, handleSearch]);

  const handleClear = useCallback(() => {
    setPhotos([]);
    setCurrentQuery('');
    setError(null);
    setCurrentPage(1);
    setHasMore(false);
    localStorage.removeItem('lastSearchQuery');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Abhay Image Search</h1>
        <SearchBar 
          onSearch={(query) => handleSearch(query)}
          onClear={handleClear}
          isLoading={isLoading}
          initialQuery={currentQuery}
        />
      </header>
      
      <main className="app-main">
        <Gallery
          photos={photos}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          error={error}
          onRetry={handleRetry}
        />
      </main>
    </div>
  );
}

export default App;