import { type UnsplashPhoto } from '../lib/unsplash';
import { ImageCard } from './ImageCard';

interface GalleryProps {
  photos: UnsplashPhoto[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  error: string | null;
  onRetry: () => void;
}

export const Gallery = ({ 
  photos, 
  isLoading, 
  hasMore, 
  onLoadMore, 
  error, 
  onRetry 
}: GalleryProps) => {
  if (error) {
    return (
      <div className="error-state">
        <div className="error-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={onRetry} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (photos.length === 0 && !isLoading) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21,15 16,10 5,21"></polyline>
          </svg>
          <h3>No images found</h3>
          <p>Try searching for something else</p>
          <button 
            onClick={() => onRetry()} 
            className="retry-button"
            style={{ marginTop: '1rem' }}
          >
            Try 'nature'
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {photos.map((photo) => (
          <ImageCard key={photo.id} photo={photo} />
        ))}
      </div>
      
      {isLoading && (
        <div className="gallery-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="image-card">
              <div className="image-container">
                <div className="image-skeleton">
                  <div className="skeleton-content"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {hasMore && !isLoading && photos.length > 0 && (
        <div className="load-more-container">
          <button 
            onClick={onLoadMore} 
            className="load-more-button"
            aria-label="Load more images"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
