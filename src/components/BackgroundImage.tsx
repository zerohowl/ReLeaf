import { ReactNode, useEffect } from 'react';

interface BackgroundImageProps {
  children: ReactNode;
}

/**
 * Premium component for rendering a full-screen background with sophisticated blur transitions
 * Enhanced to prevent repainting or resetting during page transitions
 */
const BackgroundImage = ({ children }: BackgroundImageProps) => {
  // Preload the background image to prevent flashing
  useEffect(() => {
    const img = new Image();
    img.src = '/Background.png';
    img.onload = () => {
      // Add a class to body when image is loaded to enable transitions
      document.body.classList.add('bg-image-loaded');
    };
    
    // Add global styles to prevent background shifting
    const style = document.createElement('style');
    style.textContent = `
      /* Prevent any unwanted document body movement */
      body {
        overflow-x: hidden;
        position: relative;
        margin: 0;
        padding: 0;
      }
      /* Smooth transition when image is loaded */
      .background-image-container {
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }
      body.bg-image-loaded .background-image-container {
        opacity: 1;
      }
      /* Prevent parent container shifts */
      .app-container {
        position: relative;
        min-height: 100vh;
        width: 100%;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      document.body.classList.remove('bg-image-loaded');
    };
  }, []);

  return (
    <div className="app-container">
      {/* Fixed background layer - completely stationary and persists between renders */}
      <div 
        className="background-image-container"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -10,
          filter: 'none',
          transform: 'none',
          backgroundImage: 'url("/Background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          willChange: 'transform', // Optimizes for transformations
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          maskImage: 'linear-gradient(rgba(0, 0, 0, 1.0), rgba(0, 0, 0, 1.0))',
          WebkitMaskImage: 'linear-gradient(rgba(0, 0, 0, 1.0), rgba(0, 0, 0, 1.0))',
          isolation: 'isolate',
          pointerEvents: 'none' // Prevents interaction with background
        }} 
      />
      {/* Content layer with proper z-index */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundImage;
