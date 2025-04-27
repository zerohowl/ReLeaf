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
      transition: { duration: 0.2, ease: [0.33, 1, 0.68, 1] }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: [0.33, 1, 0.68, 1] }
    }
  };

  const contentVariants = {
    initial: { y: 6, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.25, ease: [0.33, 1, 0.68, 1] }
    },
    exit: {
      y: -4,
      opacity: 0,
      transition: { duration: 0.15, ease: [0.33, 1, 0.68, 1] }
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
