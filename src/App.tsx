import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { type UnsplashPhoto, searchPhotos } from './lib/unsplash';
import { personalResults } from './lib/overrides';
import './App.css';

function App() {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load saved query and theme from localStorage on mount
  useEffect(() => {
    const savedQuery = localStorage.getItem('lastSearchQuery');
    if (savedQuery) {
      setCurrentQuery(savedQuery);
      // Don't auto-search on load, just set the query
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    const isDark = theme === 'dark';
    
    setIsDarkMode(isDark);
    document.documentElement.setAttribute('data-theme', theme);
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
      // Check for personal results first
      const personal = personalResults(query);
      
      if (personal.length > 0) {
        // Show ONLY personal results for abhay queries
        setPhotos(personal);
        setCurrentPage(1);
        setHasMore(false);
        setCurrentQuery(query);
        localStorage.setItem('lastSearchQuery', query);
        return;
      }
      
      // For other queries, use Unsplash API
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

  const toggleTheme = useCallback(() => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }, [isDarkMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Check for API key
  const hasApiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  if (!hasApiKey) {
    return (
      <div className="app">
        <Header
          onSearch={() => {}}
          onClear={() => {}}
          isLoading={false}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        <div className="api-key-alert">
          <div className="alert-content">
            <h3>⚠️ API Key Missing</h3>
            <p>Please set the VITE_UNSPLASH_ACCESS_KEY environment variable to use this application.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        onSearch={(query) => handleSearch(query)}
        onClear={handleClear}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
      
      <Hero 
        onSearch={(query) => handleSearch(query)}
        isLoading={isLoading}
      />
      
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
      
      <footer className="app-footer">
        <p>© Abhay Virus</p>
      </footer>
    </div>
  );
}

export default App;