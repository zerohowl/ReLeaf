import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface GifPlaceholderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
  children?: ReactNode;
}

/**
 * An animated placeholder component to use until real GIFs are ready
 */
const GifPlaceholder = ({ icon: Icon, title, className = '', children }: GifPlaceholderProps) => {
  return (
    <div 
      className={`w-full h-40 rounded-md overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 ${className}`}
    >
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
    </div>
  );
};

export default GifPlaceholder;
