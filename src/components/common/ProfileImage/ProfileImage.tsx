import React, { useState, useEffect } from 'react';
import './ProfileImage.css';

interface ProfileImageProps {
  src?: string | null;
  alt: string;
  displayName: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  displayName,
  size = 'medium',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  const maxRetries = 2;

  // Reset states when src changes
  useEffect(() => {
    if (src !== currentSrc) {
      setImageError(false);
      setImageLoaded(false);
      setRetryCount(0);
      setCurrentSrc(src);
    }
  }, [src, currentSrc]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const error = e.nativeEvent as ErrorEvent;
    console.error('Profile image failed to load:', currentSrc, error);
    
    // If it's a Google image and we haven't retried too many times, try again with cache busting
    if (currentSrc?.includes('googleusercontent.com') && retryCount < maxRetries) {
      console.log(`Retrying Google image load (attempt ${retryCount + 1}/${maxRetries})`);
      setRetryCount(prev => prev + 1);
      
      // Add cache busting parameter and retry after a short delay
      setTimeout(() => {
        const url = new URL(currentSrc);
        url.searchParams.set('_retry', retryCount.toString());
        url.searchParams.set('_t', Date.now().toString());
        setCurrentSrc(url.toString());
      }, 1000 * (retryCount + 1)); // Exponential backoff
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    console.log('Profile image loaded successfully:', currentSrc);
    setImageLoaded(true);
    setImageError(false);
  };

  const shouldShowImage = currentSrc && !imageError;
  const placeholderLetter = displayName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className={`profile-image-container ${size} ${className}`}>
      {shouldShowImage && (
        <img
          src={currentSrc}
          alt={alt}
          className={`profile-image-img ${imageLoaded ? 'loaded' : 'loading'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      )}
      <div 
        className={`profile-image-placeholder ${shouldShowImage && !imageError ? 'hidden' : ''}`}
      >
        {retryCount > 0 && !imageError ? (
          <div className="retry-indicator">
            <div className="spinner"></div>
          </div>
        ) : (
          placeholderLetter
        )}
      </div>
    </div>
  );
};

export default ProfileImage;
