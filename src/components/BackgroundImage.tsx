import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BackgroundImageProps {
  children: ReactNode;
  blurred?: boolean;
}

/**
 * Premium component for rendering a full-screen background with sophisticated blur transitions
 */
const BackgroundImage = ({ children, blurred = false }: BackgroundImageProps) => {
  // Enhanced animation variants for background
  const backgroundVariants = {
    unblurred: { 
      filter: 'blur(0px)',
      scale: 1.0
    },
    blurred: { 
      filter: 'blur(8px)',
      scale: 1.02 // Subtle scale effect for more dimension when blurred
    }
  };

  // Gradient overlay variants
  const gradientVariants = {
    unblurred: { 
      opacity: 0.3,
      backgroundImage: 'linear-gradient(135deg, rgba(96, 196, 85, 0.3) 0%, rgba(79, 180, 199, 0.3) 100%)'
    },
    blurred: { 
      opacity: 0.5,
      backgroundImage: 'linear-gradient(135deg, rgba(96, 196, 85, 0.4) 0%, rgba(79, 180, 199, 0.5) 100%)'
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background pattern layer with blur effect */}
      <motion.div 
        className="fixed inset-0 bg-[url('/bg-leaves.svg')] bg-cover bg-center"
        initial={blurred ? 'blurred' : 'unblurred'}
        animate={blurred ? 'blurred' : 'unblurred'}
        variants={backgroundVariants}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1.0] }}
      />
      
      {/* Enhanced gradient overlay with animation */}
      <motion.div 
        className="fixed inset-0 mix-blend-multiply"
        initial={blurred ? 'blurred' : 'unblurred'}
        animate={blurred ? 'blurred' : 'unblurred'}
        variants={gradientVariants}
        transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1.0] }}
      />
      
      {/* Content layer with fade-in */}
      <motion.div 
        className="relative z-10" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default BackgroundImage;
