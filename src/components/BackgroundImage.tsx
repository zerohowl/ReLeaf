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
      {/* Static background image */}
      <div className="fixed inset-0 bg-[url('/Background.png')] bg-cover bg-center" />
      {/* Dark overlay for contrast */}
      <div className="fixed inset-0 mix-blend-multiply bg-black/10" />
      {/* Content above background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundImage;
