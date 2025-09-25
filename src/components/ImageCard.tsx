import { useState } from 'react';
import { type UnsplashPhoto } from '../lib/unsplash';
import { triggerDownload } from '../lib/unsplash';

interface ImageCardProps {
  photo: UnsplashPhoto;
}

export const ImageCard = ({ photo }: ImageCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // First trigger the download tracking
      await triggerDownload(photo.links.download_location);
      
      // Then open the image in a new tab
      window.open(photo.links.html, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
      // Still open the image even if tracking fails
      window.open(photo.links.html, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDownload();
    }
  };

  const altText = photo.alt_description || photo.description || `Photo by ${photo.user.name}`;

  return (
    <div className="image-card">
      <div className="image-container">
        {!imageLoaded && (
          <div className="image-skeleton" aria-hidden="true">
            <div className="skeleton-content"></div>
          </div>
        )}
        <img
          src={photo.urls.small}
          alt={altText}
          className={`image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="image-overlay">
          <button
            className="download-button"
            onClick={handleDownload}
            onKeyDown={handleKeyDown}
            disabled={isDownloading}
            aria-label={`Download image by ${photo.user.name}`}
          >
            {isDownloading ? (
              <div className="spinner small" aria-hidden="true"></div>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="image-info">
        <div className="photographer-info">
          <a
            href={photo.user.links.html}
            target="_blank"
            rel="noopener noreferrer"
            className="photographer-link"
          >
            {photo.user.name}
          </a>
        </div>
        <div className="attribution">
          Photo by{' '}
          <a
            href={photo.user.links.html}
            target="_blank"
            rel="noopener noreferrer"
            className="attribution-link"
          >
            {photo.user.name}
          </a>{' '}
          on{' '}
          <a
            href={photo.links.html}
            target="_blank"
            rel="noopener noreferrer"
            className="attribution-link"
          >
            Unsplash
          </a>
        </div>
      </div>
    </div>
  );
};
