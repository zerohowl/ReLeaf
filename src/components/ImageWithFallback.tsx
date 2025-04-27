import { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageWithFallback = ({ 
  src, 
  alt, 
  fallbackSrc = '/placeholder.svg', 
  className = '',
  style = {},
  onLoad,
  onError 
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <img 
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onLoad={() => {
        if (onLoad) onLoad();
      }}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
          if (onError) onError();
        }
      }}
    />
  );
};

export default ImageWithFallback;
