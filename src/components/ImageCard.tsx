import { useState } from 'react';
import { type UnsplashPhoto } from '../lib/unsplash';
import { triggerDownload } from '../lib/unsplash';

interface ImageCardProps {
  photo: UnsplashPhoto;
  onImageClick?: (photo: UnsplashPhoto) => void;
}

export const ImageCard = ({ photo, onImageClick }: ImageCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async () => {
    if (photo.isPersonal) {
      // For personal results, just open Instagram
      window.open(photo.links.html, '_blank');
      return;
    }

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

  const handleImageClick = () => {
    onImageClick?.(photo);
  };

  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleImageClick();
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
          onClick={handleImageClick}
          onKeyDown={handleImageKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`View full size image by ${photo.user.name}`}
        />
        <div className="image-overlay">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {photo.isPersonal ? (
              <>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  color: '#000', 
                  padding: '4px 8px', 
                  borderRadius: '6px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '4px'
                }}>
                  LinkedIn
                </div>
                <button
                  className="download-button"
                  onClick={handleDownload}
                  onKeyDown={handleKeyDown}
                  disabled={isDownloading}
                  aria-label={`View ${photo.user.name} on LinkedIn`}
                  style={{ 
                    background: '#0077b5',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {isDownloading ? (
                    <div className="spinner small" aria-hidden="true"></div>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      View LinkedIn Profile
                    </>
                  )}
                </button>
                <div className="attribution" style={{ color: 'white', fontSize: '12px' }}>
                  {photo.user.name}
                  {photo.subtitle && (
                    <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>
                      {photo.subtitle}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
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
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7,10 12,15 17,10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download
                    </>
                  )}
                </button>
                <div className="attribution" style={{ color: 'white', fontSize: '12px' }}>
                  Photo by{' '}
                  <a
                    href={photo.user.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'white', textDecoration: 'underline' }}
                  >
                    {photo.user.name}
                  </a>{' '}
                  on{' '}
                  <a
                    href={photo.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'white', textDecoration: 'underline' }}
                  >
                    Unsplash
                  </a>
                </div>
              </>
            )}
          </div>
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
