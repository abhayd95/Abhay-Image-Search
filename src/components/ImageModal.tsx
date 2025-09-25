import { useEffect, useRef } from 'react';
import { type UnsplashPhoto } from '../lib/unsplash';
import { triggerDownload } from '../lib/unsplash';

interface ImageModalProps {
  photo: UnsplashPhoto | null;
  onClose: () => void;
}

export const ImageModal = ({ photo, onClose }: ImageModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (photo) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the modal
      modalRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Add escape key listener
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
        
        // Restore focus
        previousActiveElement.current?.focus();
      };
    }
  }, [photo, onClose]);

  if (!photo) return null;

  const handleDownload = async () => {
    if (photo.isPersonal) {
      window.open(photo.links.html, '_blank');
      return;
    }

    try {
      await triggerDownload(photo.links.download_location);
      window.open(photo.links.html, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
      window.open(photo.links.html, '_blank');
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(photo.links.html);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="modal-content"
        tabIndex={-1}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="modal-image-container">
          <img
            src={photo.urls.regular}
            alt={photo.alt_description || photo.description || `Photo by ${photo.user.name}`}
            className="modal-image"
          />
        </div>
        
        <div className="modal-info">
          <h3 id="modal-title" className="modal-title">
            {photo.user.name}
          </h3>
          {photo.description && (
            <p className="modal-description">
              {photo.description}
            </p>
          )}
          {photo.alt_description && photo.alt_description !== photo.description && (
            <p className="modal-alt">
              {photo.alt_description}
            </p>
          )}
          
          <div className="modal-actions">
            <button
              className="modal-action-button primary"
              onClick={handleDownload}
            >
              {photo.isPersonal ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  View Profile
                </>
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
            
            <button
              className="modal-action-button secondary"
              onClick={() => window.open(photo.links.html, '_blank')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Open on {photo.isPersonal ? 'LinkedIn' : 'Unsplash'}
            </button>
            
            <button
              className="modal-action-button secondary"
              onClick={handleCopyUrl}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
