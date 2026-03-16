import React, { useState, useEffect, useRef } from 'react';

export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
}

/**
 * LazyImage component uses Intersection Observer API to lazy load images.
 * Images are only loaded when they enter the viewport.
 * 
 * Requirements: 17.1
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3ENo Photo%3C/text%3E%3C/svg%3E',
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholderSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setHasError(false);
    
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load image immediately if Intersection Observer is not supported
      console.log('IntersectionObserver not supported, loading image immediately:', src);
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is in viewport, load it
            console.log('Image entering viewport, loading:', src);
            setImageSrc(src);
            // Stop observing once image is loaded
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        // Load image when it's 50px away from entering the viewport
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  const handleLoad = () => {
    console.log('Image loaded successfully:', src);
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image: ${src}`, e);
    console.error('Current imageSrc:', imageSrc);
    setHasError(true);
    setImageSrc(placeholderSrc);
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${!isLoaded && !hasError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};
