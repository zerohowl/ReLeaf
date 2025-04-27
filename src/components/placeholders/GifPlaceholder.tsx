import { ReactNode, useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';

interface GifPlaceholderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
  children?: ReactNode;
  gifSrc?: string; // Path to the actual GIF file
}

/**
 * A component to display instructional GIFs
 */
const GifPlaceholder = ({ icon: Icon, title, className = '', children, gifSrc }: GifPlaceholderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Reset states when gifSrc changes
    if (gifSrc) {
      setIsLoaded(false);
      setHasError(false);
    }
  }, [gifSrc]);
  return (
    <div 
      className={`w-full h-56 rounded-md overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 ${className}`}
    >
      {/* Show actual GIF if available */}
      {gifSrc ? (
        <div className="relative w-full h-full">
          <ImageWithFallback 
            src={gifSrc} 
            alt={title}
            className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ transition: 'opacity 0.3s ease' }}
            fallbackSrc="/placeholder.svg"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
          
          {/* Overlay with title and description */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-sm font-semibold text-white">{title}</p>
            {children && (
              <div className="mt-1 text-xs text-white/80 max-w-full">{children}</div>
            )}
          </div>
          
          {/* Loading state */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="w-10 h-10 border-4 border-eco-green/30 border-t-eco-green rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Fallback to placeholder if no GIF provided */}
          {/* Background Pattern for visual interest */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" 
              style={{
                backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
          </div>

          {/* Main Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
            <div className="w-14 h-14 rounded-full bg-eco-green/10 dark:bg-eco-green/20 flex items-center justify-center mb-3 shadow-sm">
              <Icon className="h-7 w-7 text-eco-green animate-bounce" style={{
                animation: 'bounce 3s infinite'
              }} />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</p>
            {children && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 max-w-[90%]">{children}</div>
            )}
          </div>
          
          {/* Animated elements */}
          <div className="absolute bottom-0 left-0 h-1.5 bg-eco-green/70" style={{
            width: '50%',
            animation: 'pulse 3s ease-in-out infinite'
          }} />
        </>
      )}
    </div>
  );
};

export default GifPlaceholder;
