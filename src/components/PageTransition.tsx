import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Enhanced page transition component with premium animations
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  // Create a more sophisticated animation sequence for premium feel
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.4, 
        ease: [0.25, 0.1, 0.25, 1.0], // Enhanced cubic bezier for luxury feel
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0],
      }
    }
  };

  const contentVariants = {
    initial: { y: 15, opacity: 0, scale: 0.98 },
    animate: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.34, 1.56, 0.64, 1], // Spring-like effect for more premium feel
      }
    },
    exit: { 
      y: -10, 
      opacity: 0,
      scale: 0.96,
      transition: { 
        duration: 0.3, 
        ease: [0.36, 0, 0.66, -0.56], // Quick fade out
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full h-full"
    >
      <motion.div variants={contentVariants}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default PageTransition;
