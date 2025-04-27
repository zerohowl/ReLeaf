import { ReactNode } from 'react';

interface BackgroundImageProps {
  children: ReactNode;
}

/**
 * Premium component for rendering a full-screen background with sophisticated blur transitions
 */
const BackgroundImage = ({ children }: BackgroundImageProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Blurred background image with improved stability */}
      <div 
        className="fixed inset-0 bg-[url('/Background.png')] bg-cover bg-center filter blur-lg scale-105"
        style={{ 
          backgroundAttachment: 'fixed',
          transform: 'translateZ(0)', // Force GPU acceleration
          willChange: 'transform', // Hint to browser about the property that will change
          backfaceVisibility: 'hidden' // Prevent flickering in some browsers
        }} 
      />
      {/* Content above background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundImage;
