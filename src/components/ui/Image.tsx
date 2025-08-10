import React, { useState } from 'react';
import { ImageUploadService } from '../../lib/uploadService';

interface ImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  onLoad?: () => void;
}

export default function Image({
  src,
  alt,
  className = '',
  fallbackSrc = 'https://via.placeholder.com/800x400/e5e7eb/6b7280?text=No+Image',
  onError,
  onLoad
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (!src) return fallbackSrc;
    
    // Handle base64 images
    if (src.startsWith('data:')) {
      return src;
    }
    
    // Get proper image URL
    const imageUrl = ImageUploadService.getImageUrl(src);
    console.log('Image component - Original src:', src);
    console.log('Image component - Constructed URL:', imageUrl);
    return imageUrl || fallbackSrc;
  });
  
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.error('Image failed to load:', imgSrc);
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      onError?.();
    }
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', imgSrc);
    setHasError(false);
    onLoad?.();
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
}
